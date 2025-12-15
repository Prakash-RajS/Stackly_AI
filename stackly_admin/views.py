from django.contrib.auth import authenticate, login, logout
from django.shortcuts import render, redirect
from django.contrib import messages
from django.db.models import Count
from django.db.models.functions import TruncDate, TruncMonth
from django.utils.timezone import now, timedelta
from django.utils import timezone
from datetime import timedelta
from django.contrib.auth import get_user_model
from django.contrib.auth.decorators import login_required, user_passes_test
from django.contrib import messages
from django.contrib.auth import update_session_auth_hash
from django.contrib.auth.forms import PasswordChangeForm
from django.http import HttpResponseNotFound
from django.contrib.auth.hashers import make_password 
from django.contrib.auth.hashers import check_password 
from .utils import add_notification
from django.core.mail import EmailMessage
from django.shortcuts import render, redirect, get_object_or_404
import random
from django.core.mail import send_mail
from django.http import JsonResponse
from django.db import IntegrityError
from .models import *
from django.views.decorators.csrf import csrf_protect
from django.contrib.auth import get_user_model
from .decorators import role_required
from django.contrib.auth.models import User
from django.views.decorators.csrf import csrf_exempt
from datetime import datetime
from django.utils import timezone
from datetime import timedelta
from django.utils.dateparse import parse_datetime
from datetime import datetime
from django.utils import timezone
import os
from django.http import JsonResponse
from django.views.decorators.http import require_POST
from appln.models import AdminNotification
from django.views.decorators.csrf import csrf_exempt
from dotenv import load_dotenv

load_dotenv()

EMAIL_BACKEND = os.getenv('EMAIL_BACKEND')
EMAIL_HOST = os.getenv('SMTP_HOST')
EMAIL_PORT = int(os.getenv('SMTP_PORT', 587))
EMAIL_USE_TLS = os.getenv('EMAIL_USE_TLS') == 'True'
EMAIL_HOST_USER = os.getenv('SMTP_USER')
EMAIL_HOST_PASSWORD = os.getenv('SMTP_PASS')
DEFAULT_FROM_EMAIL = os.getenv('EMAIL_FROM')
SUPERADMIN_EMAIL =os.getenv('SUPERADMIN_EMAIL')


ADMIN_ROLES = ['Admin', 'Moderator']
User = get_user_model()

@role_required('SuperAdmin')
def access_management(request):
    if not request.user.is_authenticated:
        return redirect('admin_login')
    
    try:
        profiles = UserProfile.objects.get(user=request.user)
    except UserProfile.DoesNotExist:
        profiles = None
    user_notifications = Notification.objects.filter(register=request.user, is_read=False)
    admin_notifications = AdminNotification.objects.filter(is_read=False)

    # Merge and sort by created_at descending
    all_notifications = sorted(
        chain(user_notifications, admin_notifications),
        key=attrgetter('created_at'),
        reverse=True
    )

    # Count unread notifications (all are unread, so length works)
    unread_count = len(all_notifications)

    # Limit top 5
    all_notifications = all_notifications[:5] # top 5 notifications
    if request.method == 'POST':
        action = request.POST.get('action')

        if action == 'add':
            username = request.POST.get('username')
            email = request.POST.get('email')
            password = request.POST.get('password')
            role = request.POST.get('role')

            if User.objects.filter(username=username).exists():
                messages.error(request, "Username already exists.", extra_tags="user_action")
            elif User.objects.filter(email=email).exists():
                messages.error(request, "Email already exists.", extra_tags="user_action")
            elif role == 'SuperAdmin':
                messages.error(request, "Cannot create SuperAdmin from UI.", extra_tags="user_action")
            else:
                user = User.objects.create(
                    username=username,
                    email=email,
                    password=make_password(password),
                    is_active=True,
                    role=role
                )
                user.is_staff = (role in ADMIN_ROLES)
                user.save()
                messages.success(request, f"User '{username}' added successfully.", extra_tags="user_action")

        elif action == 'edit':
            user_id = request.POST.get('user_id')
            username = request.POST.get('username')
            email = request.POST.get('email')
            role = request.POST.get('role')

            user = get_object_or_404(User, id=user_id)
            user.username = username
            user.email = email
            user.role = role
            user.is_staff = (role in ADMIN_ROLES)
            user.is_superuser = False
            user.save()
            messages.success(request, f"User '{username}' updated successfully.", extra_tags="user_action")

        elif action == 'delete':
            user_id = request.POST.get('user_id')
            user = get_object_or_404(User, id=user_id)
            if user.is_superuser:
                messages.error(request, "Cannot delete SuperAdmin.", extra_tags="user_action")
            else:
                user.delete()
                messages.success(request, "User deleted successfully.", extra_tags="user_action")

        elif action == 'toggle':
            user_id = request.POST.get('user_id')
            user = get_object_or_404(User, id=user_id)
            if user.is_superuser:
                messages.error(request, "Cannot deactivate SuperAdmin.", extra_tags="user_action")
            else:
                user.is_active = not user.is_active
                user.save()
                messages.success(request, "User status updated.", extra_tags="user_action")

        return redirect('access_management')

    admins = User.objects.filter(is_superuser=False, role='Admin')
    moderators = User.objects.filter(is_superuser=False, role='Moderator')

    context = {
        'admins': admins,
        'moderators': moderators,
        'admin_count': admins.count(),
        'moderator_count': moderators.count(),
        'unread_count':unread_count,
        'notifications':all_notifications,
        'profiles':profiles
    }
    return render(request, 'access_management.html', context)


# 403 permission denied handler
def permission_denied(request, exception=None):
    return render(request, '403.html', status=403)
# Login View
def user_login(request):
    if request.user.is_authenticated:
        return redirect('dashboard')

    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')

        user = authenticate(request, username=username, password=password)

        if user is not None:
            if user.is_active and user.is_staff:  # allow Admins and Moderators
                login(request, user)
                return redirect('dashboard')
            else:
                messages.error(request, "You don't have permission to access this area.")
        else:
            messages.error(request, 'Invalid username or password.')

    return render(request, 'ad_login.html')


# Logout View
def user_logout(request):
    logout(request)
    return redirect('admin_login')


# @role_required(allowed_roles=['Admin'])
# @superadmin_required
# def dashboard(request):
#     if not isinstance(request.user, CustomUser ):
#         return redirect('admin_login')

#     # Get the user's profile (if it exists)
#     try:
#         profiles = UserProfile.objects.get(user=request.user)
#     except UserProfile.DoesNotExist:
#         profiles = None
    
#     # Get general data (available to all users)
#     user_count = CustomUser .objects.count()
#     active_plans = Plan.objects.filter(is_active=True).count()
#     expired_plans = Plan.objects.filter(is_active=False).count()
    
#     # Get user-specific data
#     total_api_calls = APIUsageLog.objects.filter(user=request.user).count()
#     recent_api_logs = APIUsageLog.objects.filter(user=request.user).order_by('-timestamp')[:5]
    
#     # Get notifications and unread count
    # notifications = Notification.objects.filter(register=request.user).order_by('-created_at')
    # unread_count = notifications.filter(is_read=False).count()  # Count unread notifications before slicing
    # notifications = notifications[:5]  # Now slice the notifications

#     api_goal = 100  # Could be user-specific later
#     api_progress_percent = (total_api_calls / api_goal) * 100 if api_goal > 0 else 0

#     plan_data = {
#         'active': active_plans,
#         'expired': expired_plans,
#     }

#     # Group by user_status from UserProfile
#     role_counts = UserProfile.objects.values('user_status').annotate(count=Count('user_status'))
#     role_labels = [rc['user_status'] or 'Unknown' for rc in role_counts]
#     role_data = [rc['count'] for rc in role_counts]

#     context = {
#         'user': request.user,
#         'profiles': profiles,
#         'user_count': user_count,
#         'active_plans': active_plans,
#         'expired_plans': expired_plans,
#         'total_api_calls': total_api_calls,
#         'recent_api_logs': recent_api_logs,
#         'api_goal': api_goal,
#         'api_progress_percent': api_progress_percent,
#         'notifications': notifications,
#         'unread_count': unread_count,
#         'plan_data': plan_data,
#         'role_labels': role_labels,
#         'role_data': role_data,
#     }
    
#     return render(request, 'dashboard.html', context)

from itertools import chain
from operator import attrgetter
from appln.models import UserData, UserSubscription, APILog, AdminNotification
from django.utils import timezone
from django.shortcuts import render, redirect

def dashboard(request):
    if not request.user.is_authenticated:
        return redirect("admin_login")

    # Stats
    total_users = UserData.objects.count()
    active_plans = UserSubscription.objects.filter(plan_expiring_date__gte=timezone.now()).count()
    expired_plans = UserSubscription.objects.filter(plan_expiring_date__lt=timezone.now()).count()
    total_api_calls = APILog.objects.count()

    # API Progress
    api_goal = 100
    api_progress_percent = (total_api_calls / api_goal) * 100 if api_goal > 0 else 0

    # Plans distribution
    plans_data = {
        "basic": UserSubscription.objects.filter(current_plan="basic").count(),
        "silver": UserSubscription.objects.filter(current_plan="silver").count(),
        "gold": UserSubscription.objects.filter(current_plan="gold").count(),
    }

    # API usage success vs errors
    api_data = {
        "success": APILog.objects.filter(status_code__gte=200, status_code__lt=300).count(),
        "errors": APILog.objects.exclude(status_code__gte=200, status_code__lt=300).count(),
    }

    # Coupon discounts
    coupon_data = {
        "10": UserSubscription.objects.filter(coupon_code="10OFF").count(),
        "20": UserSubscription.objects.filter(coupon_code="20OFF").count(),
        "50": UserSubscription.objects.filter(coupon_code="50OFF").count(),
    }

    # Notifications (user + admin)
    user_notifications = Notification.objects.filter(register=request.user, is_read=False)
    admin_notifications = AdminNotification.objects.filter(is_read=False)

    # Merge and sort by created_at descending
    all_notifications = sorted(
        chain(user_notifications, admin_notifications),
        key=attrgetter('created_at'),
        reverse=True
    )

    # Count unread notifications (all are unread, so length works)
    unread_count = len(all_notifications)

    # Limit top 5
    all_notifications = all_notifications[:5]

    context = {
        "total_users": total_users,
        "active_plans": active_plans,
        "expired_plans": expired_plans,
        "total_api_calls": total_api_calls,
        "api_goal": api_goal,
        "api_progress_percent": api_progress_percent,
        "plans_data": plans_data,
        "api_data": api_data,
        "coupon_data": coupon_data,
        "notifications": all_notifications,
        "unread_count": unread_count,
    }
    return render(request, "dashboard.html", context)


@role_required('SuperAdmin', 'Admin')
@role_required('SuperAdmin', 'Admin')

def manage_plans(request):
    user_notifications = Notification.objects.filter(register=request.user, is_read=False)
    admin_notifications = AdminNotification.objects.filter(is_read=False)

    # Merge and sort by created_at descending
    all_notifications = sorted(
        chain(user_notifications, admin_notifications),
        key=attrgetter('created_at'),
        reverse=True
    )

    # Count unread notifications (all are unread, so length works)
    unread_count = len(all_notifications)

    # Limit top 5
    all_notifications = all_notifications[:5]  # top 5 notifications
    if not request.user.is_authenticated:
        return redirect('admin_login')

    if request.method == 'POST':
        try:
            name = request.POST.get('plan_name')
            price = float(request.POST.get('price'))
            validity_days = int(request.POST.get('validity_days'))
            max_api_calls = int(request.POST.get('max_api_calls'))


            # Process features
            features = []
            feature_counter = 1
            while True:
                feature_text = request.POST.get(f'feature_text_{feature_counter}')
                if not feature_text:
                    break
                features.append({
                    'text': feature_text.strip(),
                    'enabled': True  # Assuming enabled if added
                })
                feature_counter += 1

            if not features:
                messages.error(request, "At least one feature is required.")
                return redirect('manage_plans')

            # Create the plan
            plan = Plan.objects.create(
                name=name,
                price=price,
                validity_days=validity_days,
                max_api_calls=max_api_calls,
                features=features
            )

            messages.success(request, "Plan created successfully.")
            return redirect('manage_plans')

        except Exception as e:
            messages.error(request, f"Failed to create plan: {str(e)}")
            return redirect('manage_plans')

    plans = Plan.objects.all().order_by('-id')
    return render(request, 'manage_plans.html', {'plans': plans , "notifications": all_notifications} )



@role_required('SuperAdmin', 'Admin')
@role_required('SuperAdmin', 'Admin')
def edit_plan(request, id):
    if not request.user.is_authenticated:
        return redirect('admin_login')

    plan = get_object_or_404(Plan, id=id)

    if request.method == 'POST':
        try:
            plan.name = request.POST.get('plan_name')
            plan.price = float(request.POST.get('price'))
            plan.validity_days = int(request.POST.get('validity_days'))
            plan.max_api_calls = int(request.POST.get('max_api_calls'))


            # Process features
            features = []
            feature_counter = 1
            while True:
                feature_text = request.POST.get(f'feature_text_{feature_counter}')
                if not feature_text:
                    break
                feature_status = request.POST.get(f'feature_status_{feature_counter}')
                is_enabled = True if feature_status == 'on' else False
                features.append({
                    'text': feature_text.strip(),
                    'enabled': is_enabled
                })
                feature_counter += 1

            if not features:
                messages.error(request, "At least one feature is required.")
                return redirect('manage_plans')

            plan.features = features
            plan.save()
            add_notification(f"Plan '{plan.name}' Updated.",request.user)

            messages.success(request, "Plan updated successfully.")
            return redirect('manage_plans')

        except Exception as e:
            messages.error(request, f"Failed to update plan: {str(e)}")
            return redirect('manage_plans')

    return render(request, 'manage_plans.html', {'plan': plan})



def delete_plan(request, id):
    plan = Plan.objects.get(id=id)
    plan.delete()
    add_notification(f"Plan '{plan.name}' deleted.",request.user)
    messages.success(request, 'Plan deleted successfully!')
    return redirect('manage_plans')

# Deactivate Plan
def deactivate_plan(request, id):
    plan = Plan.objects.get(id=id)
    plan.is_active = False
    plan.save()
    add_notification(f"Plan '{plan.name}' deactivated.",request.user)  
    messages.success(request, 'Plan deactivated successfully!')
    return redirect('manage_plans')

# Activate Plan
def activate_plan(request, id):
    plan = Plan.objects.get(id=id)
    plan.is_active = True
    plan.save()
    add_notification(f"Plan '{plan.name}' activated.",request.user)
    messages.success(request, 'Plan activated successfully!')
    return redirect('manage_plans')

# Create Coupon
# @role_required('SuperAdmin', 'Admin')
# def create_coupon(request):
#     if not request.user.is_authenticated:
#         return redirect('admin_login')  # or your login page
    
#     # Get the user's profile
#     try:
#         profiles = UserProfile.objects.get(user=request.user)
#     except UserProfile.DoesNotExist:
#         profiles = None
#     notifications = Notification.objects.filter(register=request.user).order_by('-created_at')
#     unread_count = notifications.filter(is_read=False).count()  # Count unread notifications before slicing
#     notifications = notifications[:5]  # Now slice the notifications
#     if request.method == 'POST':
#         code = request.POST.get('code')
#         discount_percentage = request.POST.get('discount_percentage')
#         description=request.POST.get("description")
#         valid_from = request.POST.get('valid_from')
#         valid_to = request.POST.get('valid_to')

#         # Check if coupon code already exists
#         if CouponCode.objects.filter(code=code).exists():
#             messages.error(request, f"Coupon code '{code}' already exists. Please choose a different code.")
#             return redirect('create_coupon')

#         # If not exists, create the coupon
#         try:
#             coupon = CouponCode.objects.create(
#                 code=code,
#                 discount_percentage=discount_percentage,
#                 description=description,
#                 valid_from=valid_from,
#                 valid_to=valid_to,
#                 is_active=True
#             )
#             messages.success(request, 'Coupon created successfully!')
#             add_notification(f"New coupon '{coupon.code}' created.", request.user)
#             return redirect('create_coupon')
#         except IntegrityError:
#             messages.error(request, "Failed to create coupon due to a database error.")
#             return redirect('create_coupon')

#     coupons = CouponCode.objects.all()
#     return render(request, 'create_coupon.html', {'coupons': coupons, 'profiles': profiles, 'notifications':notifications,'unread_count':unread_count})

# Edit Coupon
# def edit_coupon(request, id):
#     try:
#         coupon = CouponCode.objects.get(id=id)
#     except CouponCode.DoesNotExist:
#         messages.error(request, 'Coupon not found!')
#         return redirect('create_coupon')

#     if request.method == 'POST':
#         coupon.code = request.POST.get('code')
#         coupon.discount_percentage = request.POST.get('discount_percentage')
#         coupon.description=request.POST.get('description')
#         coupon.valid_from = request.POST.get('valid_from')
#         coupon.valid_to = request.POST.get('valid_to')
#         coupon.save()
#         add_notification(f"Coupon '{coupon.code}' updated.", request.user)
#         messages.success(request, 'Coupon updated successfully!')
#         return redirect('create_coupon')

    
@role_required('SuperAdmin', 'Admin')
def create_coupon(request):
    if not request.user.is_authenticated:
        return redirect('admin_login')  

    try:
        profiles = UserProfile.objects.get(user=request.user)
    except UserProfile.DoesNotExist:
        profiles = None

    user_notifications = Notification.objects.filter(register=request.user, is_read=False)
    admin_notifications = AdminNotification.objects.filter(is_read=False)

    # Merge and sort by created_at descending
    all_notifications = sorted(
        chain(user_notifications, admin_notifications),
        key=attrgetter('created_at'),
        reverse=True
    )

    # Count unread notifications (all are unread, so length works)
    unread_count = len(all_notifications)

    # Limit top 5
    all_notifications = all_notifications[:5]  # top 5 notifications

    if request.method == 'POST':
        try:
            code = request.POST.get('code')
            coupon_type = request.POST.get('coupon_type', 'general')
            offer_text = request.POST.get('offer_text')
            discount_percentage = int(request.POST.get('discount_percentage'))
            description = request.POST.get('description')
            max_uses = int(request.POST.get('max_uses', 1))
            valid_from_raw = request.POST.get('valid_from')
            valid_to_raw = request.POST.get('valid_to')

            # Parse dates safely
            try:
                valid_from = parse_datetime(valid_from_raw) or datetime.strptime(valid_from_raw, '%Y-%m-%dT%H:%M')
                valid_to = parse_datetime(valid_to_raw) or datetime.strptime(valid_to_raw, '%Y-%m-%dT%H:%M')
            except (ValueError, TypeError) as e:
                messages.error(request, f"Invalid date format: {str(e)}")
                return redirect('create_coupon')

            if valid_to <= valid_from:
                messages.error(request, "End date must be after start date.")
                return redirect('create_coupon')

            if discount_percentage <= 0 or discount_percentage > 100:
                messages.error(request, "Discount percentage must be between 1 and 100.")
                return redirect('create_coupon')

            coupon = CouponCode(
                code=code,
                offer_text=offer_text,
                discount_percentage=discount_percentage,
                description=description,
                valid_from=valid_from,
                valid_to=valid_to,
                max_uses=max_uses,
                coupon_type=coupon_type,
                is_active=True
            )

            # Plan-specific coupon
            if coupon_type == 'plan_specific':
                plan_id = request.POST.get('plan_id')
                if not plan_id:
                    messages.error(request, "Plan must be selected for plan-specific coupon.")
                    return redirect('create_coupon')
                plan = Plan.objects.get(id=plan_id)
                coupon.plan = plan

            # User-specific coupon
            elif coupon_type == 'user_specific':
                user_id = request.POST.get('user_id')
                if not user_id:
                    messages.error(request, "User must be selected for user-specific coupon.")
                    return redirect('create_coupon')
                user = User.objects.get(id=user_id)
                coupon.user = user

            coupon.save()

            messages.success(request, "Coupon created successfully.")
            return redirect('create_coupon')

        except (ValueError, IntegrityError, Exception) as e:
            messages.error(request, f"Failed to create coupon: {str(e)}")
            return redirect('create_coupon')

    # GET request
    plans = Plan.objects.filter(is_active=True)
    users = User.objects.filter(is_active=True)
    coupons = CouponCode.objects.all().order_by('-id')


    context = {
        'plans': plans,
        'users': users,
        'coupons': coupons,
        'profiles': profiles,
        'notifications': all_notifications,
        'unread_count': unread_count
    }

    return render(request, 'create_coupon.html', context)


def edit_coupon(request, id):
    if not request.user.is_authenticated:
        return redirect('admin_login')

    coupon = get_object_or_404(CouponCode, id=id)

    if request.method == 'POST':
        try:
            code = request.POST.get('code')
            coupon_type = request.POST.get('coupon_type', 'general')
            offer_text = request.POST.get('offer_text')
            discount_percentage = int(request.POST.get('discount_percentage'))
            description = request.POST.get('description')
            valid_from = request.POST.get('valid_from')
            valid_to = request.POST.get('valid_to')
            max_uses = int(request.POST.get('max_uses', 1))

            # Convert string dates to datetime objects
            try:
                valid_from = parse_datetime(valid_from) or datetime.strptime(valid_from, '%Y-%m-%d %H:%M')
                valid_to = parse_datetime(valid_to) or datetime.strptime(valid_to, '%Y-%m-%d %H:%M')
            except (ValueError, TypeError) as e:
                messages.error(request, f"Invalid date format: {str(e)}")
                return redirect('create_coupon')

            if valid_to <= valid_from:
                messages.error(request, "End date must be after start date.")
                return redirect('create_coupon')

            if discount_percentage <= 0 or discount_percentage > 100:
                messages.error(request, "Discount percentage must be between 1 and 100.")
                return redirect('create_coupon')

            # Update coupon fields
            coupon.code = code
            coupon.offer_text = offer_text
            coupon.coupon_type = coupon_type
            coupon.discount_percentage = discount_percentage
            coupon.description = description
            coupon.valid_from = valid_from
            coupon.valid_to = timezone.make_aware(valid_to)
            coupon.max_uses = max_uses

            # Plan-specific coupon
            if coupon_type == 'plan_specific':
                plan_id = request.POST.get('plan_id')
                if not plan_id:
                    messages.error(request, "Plan must be selected for plan-specific coupon.")
                    return redirect('create_coupon')
                coupon.plan_id = plan_id
                coupon.user = None  # clear any previous user assignment if any

            # User-specific coupon
            elif coupon_type == 'user_specific':
                user_id = request.POST.get('user_id')
                if not user_id:
                    messages.error(request, "User must be selected for user-specific coupon.")
                    return redirect('create_coupon')
                coupon.user_id = user_id
                coupon.plan = None  # clear any previous plan assignment if any

            # General coupon
            else:
                coupon.plan = None
                coupon.user = None

            coupon.save()

            add_notification(f"Coupon '{coupon.code}' updated.", request.user)
            messages.success(request, 'Coupon updated successfully!')
            return redirect('create_coupon')

        except (ValueError, IntegrityError) as e:
            messages.error(request, f"Error updating coupon: {str(e)}")
            return redirect('create_coupon')

    return redirect('create_coupon')

# Delete Coupon
def delete_coupon(request, id):
    try:
        coupon = CouponCode.objects.get(id=id)
    except CouponCode.DoesNotExist:
        messages.error(request, 'Coupon not found!')
        return redirect('create_coupon')

    if request.method == 'POST':
        coupon_code = coupon.code  # Save before delete
        coupon.delete()
        add_notification(f"Coupon '{coupon_code}' deleted.", request.user)
        messages.success(request, 'Coupon deleted successfully!')
        return redirect('create_coupon')
    
    # For GET or other methods, just redirect to coupon list page
    return redirect('create_coupon')


# Activate Coupon
def activate_coupon(request, id):
    try:
        coupon = CouponCode.objects.get(id=id)
    except CouponCode.DoesNotExist:
        messages.error(request, 'Coupon not found!')
        return redirect('create_coupon')

    coupon.is_active = True
    coupon.save()
    add_notification(f"Coupon '{coupon.code}' activated.", request.user)
    messages.success(request, 'Coupon activated successfully!')
    return redirect('create_coupon')

# Deactivate Coupon
def deactivate_coupon(request, id):
    try:
        coupon = CouponCode.objects.get(id=id)
    except CouponCode.DoesNotExist:
        add_notification(f"Coupon '{coupon.code}' deactivated.", request.user)
        messages.error(request, 'Coupon not found!')
        return redirect('create_coupon')

    coupon.is_active = False
    coupon.save()
    messages.success(request, 'Coupon deactivated successfully!')
    return redirect('create_coupon')
# @role_required('SuperAdmin','Admin','Moderator')
# def user_list(request):
#     notifications = Notification.objects.filter(register=request.user).order_by('-created_at')
#     unread_count = notifications.filter(is_read=False).count()  # Count unread notifications before slicing
#     notifications = notifications[:5]  # Now slice the notifications
#     if not request.user.is_authenticated:
#         return redirect('login')  # or your login page
    
#     # Get the user's profile
#     try:
#         profiles = UserProfile.objects.get(user=request.user)
#     except UserProfile.DoesNotExist:
#         profiles = None
#     users = CustomUser.objects.all()
#     if request.method == 'POST':
#         user_id = request.POST.get('user_id')
#         user = CustomUser.objects.get(id=user_id)
#         # Toggle user status
#         if user.status == "Active":
#             user.status = "Inactive"
#         else:
#             user.status = "Active"
#         user.save()
#         return redirect('user_list')  # Redirect to avoid duplicate submissions
#     return render(request, 'user_list.html', {'users': users,'profiles':profiles,'notifications':notifications,'unread_count':unread_count})

from django.db.models import Prefetch
@role_required('SuperAdmin', 'Admin', 'Moderator')
def user_list(request):
    if not request.user.is_authenticated:
        return redirect('login')

    user_notifications = Notification.objects.filter(register=request.user, is_read=False)
    admin_notifications = AdminNotification.objects.filter(is_read=False)

    # Merge and sort by created_at descending
    all_notifications = sorted(
        chain(user_notifications, admin_notifications),
        key=attrgetter('created_at'),
        reverse=True
    )

    # Count unread notifications (all are unread, so length works)
    unread_count = len(all_notifications)

    # Limit top 5
    all_notifications = all_notifications[:5]

    # Get the user's profile
    try:
        profiles = UserProfile.objects.get(user=request.user)
    except UserProfile.DoesNotExist:
        profiles = None

    # Get all users with their latest subscription
    users = UserData.objects.prefetch_related(
        Prefetch("subscriptions", queryset=UserSubscription.objects.order_by("-start_date"))
    ).all()

    # Toggle status if needed
    if request.method == 'POST':
        user_id = request.POST.get('user_id')
        user = UserData.objects.get(id=user_id)
        # Using provider as status (or add a `status` field to UserData if preferred)
        if user.provider == "inactive":
            user.provider = "active"
        else:
            user.provider = "inactive"
        user.save()
        return redirect('user_list')

    return render(request, 'user_list.html', {
        'users': users,
        'profiles': profiles,
        'notifications': all_notifications,
        'unread_count': unread_count
    })


@role_required('SuperAdmin','Admin','Moderator')
def api_usage_monitor(request):
    user_notifications = Notification.objects.filter(register=request.user, is_read=False)
    admin_notifications = AdminNotification.objects.filter(is_read=False)

    # Merge and sort by created_at descending
    all_notifications = sorted(
        chain(user_notifications, admin_notifications),
        key=attrgetter('created_at'),
        reverse=True
    )

    # Count unread notifications (all are unread, so length works)
    unread_count = len(all_notifications)

    # Limit top 5
    all_notifications = all_notifications[:5] # top 5 notifications
    if not request.user.is_authenticated:
        return redirect('login')  # or your login page
    
    # Get the user's profile
    try:
        profiles = UserProfile.objects.get(user=request.user)
    except UserProfile.DoesNotExist:
        profiles = None
    logs = APIUsageLog.objects.all().select_related('user')

    # Filtering
    user = request.GET.get('user')
    date = request.GET.get('date')
    endpoint = request.GET.get('endpoint')

    if user:
        logs = logs.filter(user__username__icontains=user)
    if date:
        logs = logs.filter(timestamp__date=date)
    if endpoint:
        logs = logs.filter(endpoint__icontains=endpoint)

    # Daily API Usage (last 7 days)
    daily_usage = (APIUsageLog.objects
                   .filter(timestamp__gte=now()-timedelta(days=7))
                   .annotate(day=TruncDate('timestamp'))
                   .values('day')
                   .annotate(count=Count('id'))
                   .order_by('day'))

    daily_dates = [entry['day'].strftime('%Y-%m-%d') for entry in daily_usage]
    daily_counts = [entry['count'] for entry in daily_usage]

    # Monthly API Usage (last 6 months)
    monthly_usage = (APIUsageLog.objects
                     .filter(timestamp__gte=now()-timedelta(days=180))
                     .annotate(month=TruncMonth('timestamp'))
                     .values('month')
                     .annotate(count=Count('id'))
                     .order_by('month'))

    monthly_months = [entry['month'].strftime('%b %Y') for entry in monthly_usage]
    monthly_counts = [entry['count'] for entry in monthly_usage]

    context = {
        'usage_logs': logs,
        'daily_dates': daily_dates,
        'daily_counts': daily_counts,
        'monthly_months': monthly_months,
        'monthly_counts': monthly_counts,
        'profiles':profiles,
        'notifications':all_notifications,
        'unread_count':unread_count
    }
    return render(request, 'api_usage_chart.html', context)

#Profile Section
@login_required
def view_profile(request):
    notifications = Notification.objects.filter(register=request.user).order_by('-created_at')
    unread_count = notifications.filter(is_read=False).count()  # Count unread notifications before slicing
    notifications = notifications[:5]  # Now slice the notifications
    try:
        profiles = UserProfile.objects.get(user=request.user)
    except UserProfile.DoesNotExist:
        return redirect("create_profile")

    return render(request, "view_profile.html", {"profiles": profiles,'notifications':notifications,'unread_count':unread_count})


# Create profile
@login_required
def create_profile(request):
    notifications = Notification.objects.filter(register=request.user).order_by('-created_at')
    unread_count = notifications.filter(is_read=False).count()  # Count unread notifications before slicing
    notifications = notifications[:5]  # Now slice the notifications
    try:
        profiles = UserProfile.objects.get(user=request.user)
        return redirect("view_profile")
    except UserProfile.DoesNotExist:
        profiles = None

    if request.method == "POST":
        image = request.FILES.get("image")
        name = request.POST.get("name")
        mobile = request.POST.get("mobile")
        email = request.POST.get("email")

        profile = UserProfile(
            user=request.user,
            image=image,
            name=name,
            mobile=mobile,
            email=email
        )
        profile.save()
        return redirect("view_profile")

    return render(request, "create_profile.html", {"profiles": profiles,'notifications':notifications,'unread_count':unread_count})


# Edit profile
@login_required
def edit_profile(request, profile_id):
    profiles = get_object_or_404(UserProfile, id=profile_id, user=request.user)
    return render(request, "edit_profile.html", {"profiles": profiles})


# Update profile
@login_required
def update_profile(request, profile_id):
    profiles = get_object_or_404(UserProfile, id=profile_id, user=request.user)

    if request.method == "POST":
        image = request.FILES.get("image")
        name = request.POST.get("name")
        mobile = request.POST.get("mobile")
        email = request.POST.get("email")

        if image:
            profiles.image = image
        profiles.name = name
        profiles.mobile = mobile
        profiles.email = email
        profiles.save()

        return redirect("view_profile")

    return render(request, "edit_profile.html", {"profiles": profiles})


# Delete profile
@login_required
def delete_profile(request, profile_id):
    profiles = get_object_or_404(UserProfile, id=profile_id, user=request.user)
    profiles.delete()
    return redirect("create_profile")

@login_required
def settings_view(request):
    user_notifications = Notification.objects.filter(register=request.user, is_read=False)
    admin_notifications = AdminNotification.objects.filter(is_read=False)

    # Merge and sort by created_at descending
    all_notifications = sorted(
        chain(user_notifications, admin_notifications),
        key=attrgetter('created_at'),
        reverse=True
    )

    # Count unread notifications (all are unread, so length works)
    unread_count = len(all_notifications)

    # Limit top 5
    all_notifications = all_notifications[:5] # top 5 notifications
    try:
        admin_settings = request.user.adminsettings
    except AdminSettings.DoesNotExist:
        admin_settings = AdminSettings.objects.create(user=request.user)

    if request.method == 'POST':
        admin_settings.email_alerts = 'email_alerts' in request.POST
        admin_settings.theme_mode = request.POST.get('theme_scheme', 'light')
        admin_settings.save()
        messages.success(request, 'Settings updated successfully!')
        return redirect('settings')
    
    # Get the current user's profile
    if not request.user.is_authenticated:
        return redirect('login')  # or your login page
    
    # Get the user's profile
    try:
        profiles = UserProfile.objects.get(user=request.user)
    except UserProfile.DoesNotExist:
        profiles = None
    return render(request, 'settings.html', {
        'settings': admin_settings,
        'profiles': profiles ,
         'notifications':all_notifications,
         'unread_count':unread_count
    })

def contact_us_admin(request):
    message = None
    error = None

    # ✅ Check login before anything else
    if not request.user.is_authenticated:
        return redirect('login')  # or your login page

    # ✅ Now it's safe to use request.user
    user_notifications = Notification.objects.filter(register=request.user, is_read=False)
    admin_notifications = AdminNotification.objects.filter(is_read=False)

    # Merge and sort by created_at descending
    all_notifications = sorted(
        chain(user_notifications, admin_notifications),
        key=attrgetter('created_at'),
        reverse=True
    )

    # Count unread notifications (all are unread, so length works)
    unread_count = len(all_notifications)

    # Limit top 5
    all_notifications = all_notifications[:5]  # top 5 notifications

    try:
        profiles = UserProfile.objects.get(user=request.user)
    except UserProfile.DoesNotExist:
        profiles = None

    if request.method == 'POST':
        name = request.POST.get('name')
        subject = request.POST.get('subject')
        email = request.POST.get('email')
        msg_body = request.POST.get('message')
        attachment = request.FILES.get('attachment')

        # Validate message length
        if len(msg_body) > 250:
            error = "Message should not exceed 250 characters."
        else:
            try:
                full_message = f"""
Hello Support Team,

You have received a new support request. Please find the details below:

Name: {name}
Email: {email}
Subject: {subject}

Message:
{msg_body}

Sent on: {timezone.now().strftime('%Y-%m-%d %H:%M:%S')}

Kind regards,  
Stackly Automated Support System
"""

                mail = EmailMessage(
                    subject=f"Support Request: {subject}",
                    body=full_message,
                    from_email=settings.EMAIL_HOST_USER,
                    to=[os.getenv('SUPERADMIN_EMAIL')],
                    reply_to=[email],
                )

                # Attach file if provided
                if attachment:
                    mail.attach(attachment.name, attachment.read(), attachment.content_type)

                mail.send()

                message = "Your message has been sent successfully."

            except Exception as e:
                error = f"An error occurred while sending the message: {str(e)}"

    return render(request, 'contact_us.html', {
        'message': message,
        'error': error,
        'profiles': profiles,
        'notifications': all_notifications,
        'unread_count': unread_count
    })


def help_center(request):
    user_notifications = Notification.objects.filter(register=request.user, is_read=False)
    admin_notifications = AdminNotification.objects.filter(is_read=False)

    # Merge and sort by created_at descending
    all_notifications = sorted(
        chain(user_notifications, admin_notifications),
        key=attrgetter('created_at'),
        reverse=True
    )

    # Count unread notifications (all are unread, so length works)
    unread_count = len(all_notifications)

    # Limit top 5
    all_notifications = all_notifications[:5] # top 5 notifications
    if not request.user.is_authenticated:
        return redirect('admin_login')  # or your login page
    
    # Get the user's profile
    try:
        profiles = UserProfile.objects.get(user=request.user)
    except UserProfile.DoesNotExist:
        profiles = None
    return render(request, 'help_center.html', {'profiles':profiles,'notifications':all_notifications,'unread_count':unread_count})
@login_required
def clear_notifications(request):
    # Mark all notifications as read
    notifications = Notification.objects.filter(register=request.user).order_by('-created_at')
    unread_count = notifications.filter(is_read=False).count()  # Count unread notifications before slicing
    notifications = notifications[:5]  # Now slice the notifications
    updated_count = notifications.update(is_read=True)

    # Set a session flag to indicate that notifications were cleared
    request.session['notifications_cleared'] = True

    return JsonResponse({'success': True, 'updated': updated_count, 'unread_count':unread_count})

@csrf_exempt
@login_required 
def mark_all_read(request):
    if request.method == 'POST':
        # Mark user notifications as read
        Notification.objects.filter(register=request.user, is_read=False).update(is_read=True)
        
        # Mark admin notifications as read
        AdminNotification.objects.filter(is_read=False).update(is_read=True)

        return JsonResponse({'status': 'success'})
    
    return JsonResponse({'status': 'error'}, status=400)

@role_required('SuperAdmin','Admin', 'Moderator')
def manage_payments(request):
    
    if not request.user.is_authenticated:
        return redirect('admin_login')

    try:
        profiles = UserProfile.objects.get(user=request.user)
    except UserProfile.DoesNotExist:
        profiles = None

    user_notifications = Notification.objects.filter(register=request.user, is_read=False)
    admin_notifications = AdminNotification.objects.filter(is_read=False)

    # Merge and sort by created_at descending
    all_notifications = sorted(
        chain(user_notifications, admin_notifications),
        key=attrgetter('created_at'),
        reverse=True
    )

    # Count unread notifications (all are unread, so length works)
    unread_count = len(all_notifications)

    # Limit top 5
    all_notifications = all_notifications[:5] # top 5 notifications

    # payments = Payment.objects.all().order_by('-payment_date')

    context = {
        # 'payments': payments,
        'profiles': profiles,
        'notifications': all_notifications,
        'unread_count': unread_count
    }

    return render(request, 'manage_payments.html', context)

@role_required('SuperAdmin')
def total_payments(request):
    user_notifications = Notification.objects.filter(register=request.user, is_read=False)
    admin_notifications = AdminNotification.objects.filter(is_read=False)

    # Merge and sort by created_at descending
    all_notifications = sorted(
        chain(user_notifications, admin_notifications),
        key=attrgetter('created_at'),
        reverse=True
    )

    # Count unread notifications (all are unread, so length works)
    unread_count = len(all_notifications)

    # Limit top 5
    all_notifications = all_notifications[:5] # top 5 notifications
    # payments = Payment.objects.all().order_by('-date')
    context = {
        # 'payments': payments,
        'title': 'All Payments',
        'status_filter': 'all',
        'notifications': all_notifications
    }
    return render(request, 'payment_details.html', context)
@role_required('SuperAdmin')
def successful_payments(request):
    user_notifications = Notification.objects.filter(register=request.user, is_read=False)
    admin_notifications = AdminNotification.objects.filter(is_read=False)

    # Merge and sort by created_at descending
    all_notifications = sorted(
        chain(user_notifications, admin_notifications),
        key=attrgetter('created_at'),
        reverse=True
    )

    # Count unread notifications (all are unread, so length works)
    unread_count = len(all_notifications)

    # Limit top 5
    all_notifications = all_notifications[:5]  # top 5 notifications
    # payments = Payment.objects.filter(status='success').order_by('-date')
    context = {
        # 'payments': payments,
        'title': 'Successful Payments',
        'status_filter': 'success',
        'notifications': all_notifications
    }
    return render(request, 'payment_details.html', context)
@role_required('SuperAdmin')
def failed_payments(request):
    user_notifications = Notification.objects.filter(register=request.user, is_read=False)
    admin_notifications = AdminNotification.objects.filter(is_read=False)

    # Merge and sort by created_at descending
    all_notifications = sorted(
        chain(user_notifications, admin_notifications),
        key=attrgetter('created_at'),
        reverse=True
    )

    # Count unread notifications (all are unread, so length works)
    unread_count = len(all_notifications)

    # Limit top 5
    all_notifications = all_notifications[:5] # top 5 notifications
    # payments = Payment.objects.filter(status='failed').order_by('-date')
    context = {
        # 'payments': payments,
        'title': 'Failed Payments',
        'status_filter': 'failed',
        'notifications': all_notifications
    }
    return render(request, 'payment_details.html', context)


from django.http import JsonResponse
from .models import Plan

def get_active_plans(request):
    plans = Plan.objects.filter(is_active=True).order_by('price')
    plan_data = []
    for plan in plans:
        offer = plan.get_offer()  # get active coupon offer if any
        plan_data.append({
            'id': plan.id,
            'name': plan.name,
            'price': float(plan.price),
            'validity_days': plan.validity_days,
            'expiry_date': plan.expiry_date,
            'max_api_calls': plan.max_api_calls,
            'features': plan.features,  # assuming this is a JSONField (list of dicts or strings)
            'is_active': plan.is_active,
            'offerCode': offer['offerCode'] if offer else None,
            'offerText': offer['offerText'] if offer else None,
            'discountPercentage': offer['discountPercentage'] if offer else 0,
        })
    return JsonResponse({'plans': plan_data})
