# Gunakan Python 3 sebagai base image
FROM python:3.11.7-bullseye

# Tetapkan working directory di dalam container
WORKDIR /app

# Salin file requirements.txt dan semua file proyek ke container
COPY requirements.txt /app/
COPY . /app/

# Install dependencies dari requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Buka port 8000
EXPOSE 8000

# Jalankan aplikasi
CMD ["python3", "main.py"]