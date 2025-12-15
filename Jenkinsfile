pipeline {
    agent none

    environment {
        GIT_REPO = 'https://github.com/thestackly/Stackly-AI.git'
        BRANCH = 'main'

        DEPLOY_USER = 'ubuntu'
        DEPLOY_HOST = '18.207.21.212'
        DEPLOY_SSH = 'ec2-deploy-key'

        REMOTE_BASE = '/home/ubuntu/Stackly_AI'
        FRONTEND_DIR = "${REMOTE_BASE}/stacklyai-new-main-main-main"
        FASTAPI_DIR = "${REMOTE_BASE}/fastapi_app"
        ADMIN_DIR = "${REMOTE_BASE}/stackly_admin"
        FRONTEND_BUILD = 'dist'

        DB_NAME = 'stackly_db'
        DB_USER = 'admin'
        DB_PASSWORD = 'StacklyDB2025'
        DB_HOST = 'stackly-ai-db.c81ekqieoxbm.us-east-1.rds.amazonaws.com'
        DB_PORT = '3306'

        EMAIL_RECIPIENTS = 'pavanb@thestackly.com, uday@thestackly.com, prakashraj@thestackly.com, thummalajayanth@thestackly.com, guntur@thestackly.com, yarramallamaheshbabu@thestackly.com, nndinesh@thestackly.com, muruganps@thestackly.com'
    }

    stages {

        /* ========== 1️⃣  CHECKOUT CODE ========== */
        stage('Checkout Code') {
            agent { label 'Website' }
            steps {
                checkout([
                    $class: 'GitSCM',
                    branches: [[name: "*/${BRANCH}"]],
                    userRemoteConfigs: [[url: "${GIT_REPO}", credentialsId: 'newtoken']]
                ])
            }
        }

        /* ========== 2️⃣  BUILD FRONTEND ========== */
        stage('Build Frontend') {
            agent { label 'Website' }
            steps {
                dir('stacklyai-new-main-main-main') {
                    sh '''
                        echo "🌐 Building Frontend..."
                        npm ci --no-audit --no-fund
                        npm run build
                    '''
                    archiveArtifacts artifacts: "${FRONTEND_BUILD}/**", fingerprint: true
                }
            }
        }

        /* ========== 3️⃣ DEPLOY TO EC2 ========== */
        stage('Deploy & Migrate') {
            agent { label 'Website' }
            steps {
                sshagent (credentials: ["${DEPLOY_SSH}"]) {
                    sh """
                        echo "🚀 Syncing project files to EC2..."
                        ssh -o StrictHostKeyChecking=no ${DEPLOY_USER}@${DEPLOY_HOST} 'mkdir -p ${REMOTE_BASE}'
                        rsync -az \
                          --exclude='**/.venv' \
                          --exclude='**/__pycache__' \
                          --exclude='node_modules' \
                          --exclude='staticfiles' \
                          --rsh='ssh -o StrictHostKeyChecking=no' \
                          ./ ${DEPLOY_USER}@${DEPLOY_HOST}:${REMOTE_BASE}/

                        echo "⚙️ Running backend setup & migrations..."
                        ssh -o StrictHostKeyChecking=no ${DEPLOY_USER}@${DEPLOY_HOST} <<'ENDSSH'
                        set -e
                        cd ${REMOTE_BASE}

                        echo "🐍 Creating virtual environment..."
                        python3 -m venv .venv

                        echo "📦 Installing dependencies inside venv..."
                        source .venv/bin/activate
                        pip install --upgrade pip setuptools wheel
                        pip install "uvicorn[standard]" websockets httptools uvloop
                        pip install -r requirements.txt

                        echo "🚀 Applying Django migrations..."
                        python manage.py makemigrations --noinput
                        python manage.py migrate --noinput

                        echo "📁 Collecting static files..."
                        python manage.py collectstatic --noinput

                        echo "🗄️ Ensuring RDS database exists..."
                        mysql -h ${DB_HOST} -u ${DB_USER} -p${DB_PASSWORD} -e "CREATE DATABASE IF NOT EXISTS ${DB_NAME} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
ENDSSH
                    """
                }
            }
        }

        /* ========== 4️⃣ RESTART SERVICES ========== */
        stage('Restart Services') {
            agent { label 'Website' }
            steps {
                sshagent (credentials: ["${DEPLOY_SSH}"]) {
                    sh """
                        ssh -o StrictHostKeyChecking=no ${DEPLOY_USER}@${DEPLOY_HOST} <<ENDSSH
                        set -e

                        echo "[1/3] Deploying Frontend..."
                        cd ${FRONTEND_DIR}
                        sudo rm -rf /var/www/html/*
                        sudo cp -r ${FRONTEND_BUILD}/* /var/www/html
                        sudo chown -R www-data:www-data /var/www/html

                        echo "🔁 Restarting backend services..."
                        sudo systemctl daemon-reload
                        sudo nginx -t
                        sudo systemctl restart nginx
                        sudo systemctl restart fastapi_app.service || true
                        sudo systemctl restart stackly_admin.service || true

                        echo "✅ Deployment Complete — Django (8001) + FastAPI (8000) + NGINX (443)"
ENDSSH
                    """
                }
            }
        }
    }

    post {
        success {
            emailext(
                subject: "✅ Stackly-AI Deployment SUCCESS on ${DEPLOY_HOST}",
                to: "${EMAIL_RECIPIENTS}",
                body: """
                    <h2>Deployment Successful 🎉</h2>
                    <p><b>Server:</b> ${DEPLOY_HOST}</p>
                    <p><b>Branch:</b> ${BRANCH}</p>
                    <p><b>Database:</b> ${DB_NAME} @ ${DB_HOST}</p>
                    <p>✅ NGINX + Django + FastAPI restarted successfully.</p>
                    <p>Timestamp: ${new Date()}</p>
                """
            )
        }
        failure {
            emailext(
                subject: "❌ Stackly-AI Deployment FAILED on ${DEPLOY_HOST}",
                to: "${EMAIL_RECIPIENTS}",
                body: """
                    <h2>Deployment Failed 🚨</h2>
                    <p><b>Server:</b> ${DEPLOY_HOST}</p>
                    <p><b>Branch:</b> ${BRANCH}</p>
                    <p>❌ Check Jenkins console logs for full stack trace.</p>
                    <p>Timestamp: ${new Date()}</p>
                """
            )
        }
    }
}