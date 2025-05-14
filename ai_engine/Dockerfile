# ai_engine/Dockerfile

FROM python:3.11-slim

WORKDIR /app

COPY app.py .
COPY model_config.json ./model_config.json

RUN pip install requests

CMD ["python", "app.py"]
