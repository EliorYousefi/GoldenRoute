# Golden Route Project

## Project Description

The Golden Route project is designed to develop a system for decision-makers. The system allows users to:

- Input Coordinates: The decision-makers can enter coordinates that represent a potential threat location from which an aircraft might originate.
- Specify Maximum Flight Radius: Users can input a maximum flight radius, indicating the distance within which the system should check for aircraft.
- Calculate Threat Range: Given the coordinates and the maximum flight radius, the system will calculate whether there are any aircraft within the specified threat range.

In summary, the system aims to provide decision-makers with the ability to assess the presence of aircraft within a designated threat area, helping to improve situational awareness and response planning.

The backend is built using TypeScript, Express, and Prisma, while the frontend is developed with Vite and React. The entire project is containerized using Docker, making it easy to deploy and run in any environment.

## Prerequisites

Before you begin, ensure you have the following installed on your machine:

- Docker: [Install Docker](https://docs.docker.com/get-docker/)
- Git: [Install Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)

## Getting Started

### 1. Clone the Repository

First, clone the repository to your local machine using Git:

```bash
git clone https://github.com/your-username/golden-route.git
```

Navigate into the project directory:

```bash
cd golden-route
```

2. Build and Run the Project
To build and run the project using Docker, open your terminal in the project directory and run the following command:

```bash
docker-compose up --build
```
This command will build the Docker images and start the application.

3. Access the Application
Once the containers are up and running, you can access the application in your web browser:

Frontend: http://localhost:4000/
Backend API: http://localhost:4100/ (For API access only)

## Project Structure
- backend/: Contains the backend API built with Express, TypeScript, and Prisma.
- frontend/: Contains the frontend application built with React and Vite.
- docker-compose.yml: Docker Compose file that defines the services, networks, and volumes.

### Technologies Used
- Docker: Containerization platform to package and deploy the application.
- TypeScript: Programming language used for the backend.
- Express: Web framework for building the backend API.
- Prisma: ORM for interacting with the PostgreSQL database.
- React: Frontend library for building the user interface.
- Vite: Build tool for the frontend application.
- PostgreSQL: Relational database used for storing data.

## Troubleshooting
If you encounter any issues while running the project, consider the following:

Ensure Docker is running correctly on your machine.
- Verify that no other services are using ports 4000 or 4100.
- Check the Docker container logs for any errors.
- For further assistance, please refer to the official documentation or reach out to my mail elioryous@gmail.com
