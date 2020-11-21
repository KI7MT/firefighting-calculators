# Firefighting Calculators

Small collection of common firefighting calculators used by IC's (Incident 
Commanders). Coding is all HTML, CSS, Bootstrap with jQuery form validation

## Running the App In Docker

First, build the image

```bash
# Build the image

docker build -t fcalc .
```

Run the built image

```bash
# Run the image
docker run -p 5000:90 fcalc
```

In a browser, navigate to
```bash
# Launch the site
localhost:5000
```

## Remove The Built Images

This will stop and remove all running images. If you do not want this behaviour, you must stop and remove them individually.

```bash
# List the containers
sudo docker ps

# Stop The Containers
sudo docker stop $(sudo docker ps -aq)

# Remove All Stopped Containers
sudo docker rm $(sudo docker ps -aq)

```

## Running Wtthout Docker

This app can be run without Docker. Just checkout the repository and, then
browse to and open the `index.html` file.
