#!/bin/bash


python3 manage.py migrate
python3 manage.py runserver 0.0.0.0:8000

# if [ "$DEPLOY" = "TRUE" ]; then
#     echo "------------------------------------------------------------------------------------"
#     echo "RUNNING DEPLOY"
#     echo "------------------------------------------------------------------------------------"
#     gunicorn --workers 6 --threads 6 conf.wsgi --bind [::]:8000 --log-level=debug \
#      --access-logfile '-' --error-logfile '-' \
#      --access-logformat "%(m)s: %(U)s - %(s)s"
# else
#     echo "------------------------------------------------------------------------------------"
#     echo "RUNNING TEST"
#     echo "------------------------------------------------------------------------------------"
#     # gunicorn --workers 2 --threads 2 conf.wsgi --bind [::]:8000 --reload --log-level=debug \
#     gunicorn --workers 2 --threads 2 conf.wsgi --bind 0.0.0.0:8000 --reload --log-level=debug \
#      --access-logfile '-' --error-logfile '-' \
#      --access-logformat "%(m)s: %(U)s - %(s)s"
# fi