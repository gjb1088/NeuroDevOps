FROM python:3.11-slim

WORKDIR /app
COPY src/collector.py .

RUN pip install --no-cache-dir psutil redis

ENV PYTHONUNBUFFERED=1
CMD ["python", "collector.py"]
