# API-Driven Load-Balanced Application


## Overview


This application is a backend FastAPI service integrated with a simple frontend. It leverages external APIs and provides a meaningful user experience by allowing user authentication, personalized data handling, and other interactive features. The app is designed for deployment on a load-balanced infrastructure for scalability and availability. It simulates a job application tracker.

**Key functionalities include:**  
- User job application tracking (CRUD)  
- Fetching new job listings from external APIs  
- Resume/CV review tailored to job applications  
- Skill gap analysis and resource recommendations  
- Essay (cover letter) grammar feedback  


---


## Demo Video


Link to demo video showcasing application usage:  
[Demo Video](https://youtu.be/gf6kQNri6hk)


---


## Local Setup & Running


### Clone the repository to your local machine:

git clone https://github.com/m-dhieu/API_Driven-Load-Balanced-App.git

`cd API_Driven-Load-Balanced-App`


### Run the application with a Docker container locally:

`docker compose up -d --build`

Ensure you have Docker installed

Open your browser at: [http://localhost:8080](http://localhost:8080)

The frontend JS should call the backend APIs at http://localhost:8080.


### Test locally:

`curl http://localhost:8080`


---


## Docker: Building and Running Locally


### Build Docker image:


From project root:

`docker build -f backend/Dockerfile -t mydockerhubusername/myimagename:v1 .`


### Run Docker container locally:

`docker run -p 8080:8080 mydockerhubusername/myimagename:v1`


Test API:

`curl http://localhost:8080/api/auth/login`

or: 

`curl http://localhost:8080`

Adjust the endpoint as per the app routes.

Note: A straightforward way is to bring up the lab environment from the project root to build the image on the first run, as shown in [image1](https://imgpx.com/7UWcQHRBcP4J.jpg), [image2](https://imgpx.com/U5m6XldJ1s8J.png), and [image3](https://imgpx.com/KVURgDE52Zdy.jpg). Use:

`docker compose up -d --build`


---


## Deployment on Lab Servers


### On Web01 and Web02 nodes:


SSH into each server and perform:

`docker pull mdhieu/api_driven-load-balanced-app:v1`

`docker run -d --name app11 --restart unless-stopped -p 8080:8080 mdhieu/api_driven-load-balanced-app:v1`


Confirm app accessibility at:

- [web-01](http://52.91.19.144:8080) 
- [web-02](http://13.221.66.135:8080)
- [@mdhieu.tech](http://mdhieu.tech:8080)


---


## Configuring Load Balancer on Lb01


Edit `/etc/haproxy/haproxy.cfg` (or your mounted config) to include:

- backend webapps
- balance roundrobin
- server web01 172.20.0.11:8080 check
- server web02 172.20.0.12:8080 check


Reload HAProxy:

`docker exec -it lb-01 sh -c 'haproxy -sf $(pidof haproxy) -f /etc/haproxy/haproxy.cfg'`


---


## Testing Load Balancer


From your host machine:

`curl http://localhost`

Run multiple times and confirm response data alternates between Web01 and Web02 instances, proving effective round-robin load balancing.

You can loop and create custom headers like 'mdhieu' for 'web01' and 'aben' for 'web02', as shown in [image](https://imgpx.com/Bfoc9E7VQEod.png).


---


## Security and API Key Handling


- API keys such as `RAPIDAPI_KEY` are passed as environment variables and never baked into the Docker image.  
- This practice secures sensitive credentials from being exposed publicly in repositories or container images.


Example running container with environment variable:

`docker run -d -p 8080:8080 -e RAPIDAPI_KEY="your_actual_rapidapi_key" yourdockerhubusername/yourimagename:v1`


---


## Challenges and Solutions


- Configuring correct filesystem paths inside containers to serve frontend static files alongside backend API. Resolved via proper relative path computation.  
- Ensuring Docker build context included all necessary files for both frontend and backend.  
- Setting up and validating HAProxy load balancer configuration for seamless request distribution.  
- Securing API keys from exposure using environment variables.


---


## Resources


APIs Used:
- Grammar check by [LanguageTool API](https://dev.languagetool.org/public-http-api.html) 
- Job listings by [Himalayas API](https://himalayas.app/jobs/api) 
- Resume parsing by Resume Parsing API by [Rapid API](https://rapidapi.com/my-path-my-path-default/api/resume-parser-and-analyzer)

Tools Used:
- Return static resources for demonstration from [Khan Academy](https://www.khanacademy.org)  
- Return static resources for demonstration from [freecodecamp](https://www.freecodecamp.org)  
- Regex patterns for scraping skills from job descriptions/URL
- Database manager with SQLite database

View documentation after running the application at [http://localhost:8080/docs](http://localhost:8080/docs) to see a list of endpoints and schemas grouped under main prefixes based on the routers in my backend app setup. These organize all the API endpoints exposed for my application. These include: Job application tracking, CRUD actions, Resume/CV review and tailoring, Cover letter/essay grammar feedback, Skill gap analysis and recommendations, User authentication (login/signup), User management


---


## Credits


- External API providers: [LanguageTool API](https://dev.languagetool.org/public-http-api.html), [Himalayas API](https://himalayas.app/jobs/api), [Rapid API](https://rapidapi.com/my-path-my-path-default/api/resume-parser-and-analyzer)
- Frameworks and tools: FastAPI, HAProxy, Docker, Regex   
- Learning resources: [Responsive Web Design Basics - Google Developers](https://developers.google.com/web/fundamentals/design-and-ux/responsive), [waka-man github](https://github.com/waka-man/web_infra_lab), [Reqres API Docs](https://reqres.in/api-docs/), [freecodecamp](https://www.freecodecamp.org) 


---


## Project Directory Structure
```
API_Driven-Load-Balanced-App/
│
├── backend/                   # Backend API source code (FastAPI likely)
│   ├── app/                   # Application modules
│   ├── job_tracker.db         # Database         
│   ├── requirements.txt       # Python dependencies
│   ├── .env                   # Store configuration settings
│   └── Dockerfile             # Docker file for backend container
│
├── frontend/                  # Static files
│   ├── cs/
│   ├── js/
│   └── files.html          
│
├── docker-compose.yml         # Docker Compose file defining multi-container setup
├── .dockerignore              # Files/folders Docker should ignore
├── .gitignore                 # Untracked files that Git should ignore
├── README.md                  # Project overview and instructions
├── LICENSE                    # License file
└── index.html                 # Landing page

```

---


## License

This project is under the MIT License.


---


## Contributing

Welcome to contribute:

1. Fork the repository.

2. Create a new branch for your feature or bug fix.

3. Commit your changes with clear, concise messages.

4. Push to your fork and open a pull request.

Thank you for considering contributing. Feel free to open issues for questions, suggestions, or bug reports.


---


## Contact

For any queries or feedback, reach out to:

**Monica Dhieu**  
Email: [m.dhieu@alustudent.com](mailto:m.dhieu@alustudent.com)  
GitHub: [https://github.com/m-dhieu](https://github.com/m-dhieu) 


---

*Friday, August 1, 2025*

