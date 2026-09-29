# Student Feedback Portal

Responsive HTML, CSS, and JavaScript feedback portal packaged with Docker and built/deployed by a Windows Jenkins pipeline.

## Run with Docker Desktop

Start Docker Desktop and wait until its engine is running. In PowerShell from this folder, add Docker Desktop's CLI folder to this terminal's path and build the image:

```powershell
$dockerDir = Join-Path $env:LOCALAPPDATA 'Programs\DockerDesktop\resources\bin'
$env:PATH = "$dockerDir;$env:PATH"
docker build -t student-feedback:latest .
```

For a first run, start it with `docker run -d --name student-feedback-portal -p 8081:80 student-feedback:latest`. To start it again after it has been stopped, run `docker start student-feedback-portal`. Open <http://localhost:8081>. The image name matches the Docker Desktop screenshot. Jenkins uses port `8080`, so the portal is published on `8081`.

## GitHub repository

The project repository is [SHIVA04-code/student-feedback-portal](https://github.com/SHIVA04-code/student-feedback-portal). To publish a later local change, commit it and push the `main` branch:

```powershell
git add .
git commit -m "Describe your change"
git push origin main
```

## Create the Jenkins job

1. Open Jenkins at <http://localhost:8080> and create a **Pipeline** job named `Student-Feedback-Pipeline`.
2. Under **Pipeline**, select **Pipeline script from SCM**, choose **Git**, enter your GitHub repository URL, set branch to `*/main`, and set **Script Path** to `Jenkinsfile`.
3. On the Jenkins **Manage Jenkins → System → Global properties** page, add `DOCKER_CLI` with the full path to `docker.exe`. A per-user Docker Desktop install is usually under `%LOCALAPPDATA%\Programs\DockerDesktop\resources\bin\docker.exe`; an all-users install is usually under `C:\Program Files\Docker\Docker\resources\bin\docker.exe`. The pipeline also adds the executable's folder temporarily to its PATH so Docker can find its credential helper.
4. Save and select **Build Now**. A successful `main` build creates the `student-feedback:latest` image and runs the portal container. Open <http://localhost:8081>.

GitHub's cloud webhook cannot call a private `localhost` Jenkins address. For a local demo, use **Build Now** or configure Jenkins polling. A webhook requires a secure, publicly reachable Jenkins endpoint.

## Windows service note

On Windows, a Jenkins service running as `LocalSystem` may not be able to access Docker Desktop's per-user CLI or engine. If **Check Docker** cannot connect after Docker Desktop is running, use a Jenkins agent running in your signed-in Windows session, or configure the Jenkins service to run under the Windows account that runs Docker Desktop, then restart the service. Jenkins jobs then execute with that account's permissions; use this setup only for trusted project code.

## Feedback storage

Submissions are saved only in the browser's local storage. The page has no server or shared database yet; connect a backend before collecting real student feedback.
