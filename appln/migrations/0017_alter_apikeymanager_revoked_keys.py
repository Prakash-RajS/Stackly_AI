# Generated by Django 5.2 on 2025-05-15 05:44

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('appln', '0016_apikeymanager_is_active_apikeymanager_usage_count'),
    ]

    operations = [
        migrations.AlterField(
            model_name='apikeymanager',
            name='revoked_keys',
            field=models.JSONField(blank=True, default=list, null=True),
        ),
    ]
