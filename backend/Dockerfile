FROM python:3.11-bullseye

### PostGis ###
# Install necessary GDAL runtime and development libraries.
RUN apt-get update && apt-get install -y --no-install-recommends \
    gdal-bin \
    libgdal-dev \
    libgeos-dev \
    binutils \
    python3-dev \
    && rm -rf /var/lib/apt/lists/*

# Create symbolic links that match your settings.py.
RUN ln -s /usr/lib/x86_64-linux-gnu/libgdal.so.29 /usr/local/lib/libgdal.so
RUN ln -s /usr/lib/x86_64-linux-gnu/libgeos_c.so.1 /usr/local/lib/libgeos_c.so
RUN ldconfig

# Set the working directory inside the container
WORKDIR /src

# Set environment variables for the application.
ENV PYTHONPATH=/src
ENV DJANGO_SETTINGS_MODULE=paddle_nav_proj.settings

# Copy requirements.txt and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the entire project code from the build context (./backend/) to the WORKDIR
COPY . .

# Expose the port
EXPOSE 8000

# The command to run your server.
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "paddle_nav_proj.wsgi:application"]