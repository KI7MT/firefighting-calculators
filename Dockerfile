#
# Fire Fighting Calculator Dockerfile File
#
FROM ubuntu:latest
USER root

# Install dependencies
RUN apt-get update
RUN apt-get install -y nginx nodejs

# Remove default Nginx configuration file
RUN mv /etc/nginx/nginx.conf /etc/nginx/nginx.conf.bak

# Copy configuration file to Nginx conf directory
ADD ./nginx/nginx.conf /etc/nginx/
ADD web /usr/share/nginx/html/
ADD web /var/www/html/

# Append "daemon off;" to the beginning of the configuration
RUN echo "daemon off;" >> /etc/nginx/nginx.conf

# Expose port
EXPOSE 90

# Execute the service
CMD service nginx start
