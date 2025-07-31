import os

# Define root folder for backend
root = "backend"

# Define folders and files to create
structure = {
    "app": {
        "__init__.py": "",
        "main.py": "",
        "routers": {
            "__init__.py": "",
            "jobs.py": "",
            "cv_review.py": "",
            "grammar_check.py": "",
            "resources.py": ""
        },
        "services": {
            "__init__.py": "",
            "job_service.py": "",
            "cv_service.py": "",
            "grammar_service.py": "",
            "resource_service.py": ""
        },
        "models": {},
        "schemas": {},
        "core": {
            "__init__.py": "",
            "config.py": ""
        },
        "dependencies.py": "",
        "utils.py": ""
    },
    "tests": {},
    ".env": "",
    "requirements.txt": "",
    "Dockerfile": "",
    "README.md": ""
}

def create_structure(base_path, struct):
    for name, content in struct.items():
        path = os.path.join(base_path, name)
        if isinstance(content, dict):
            if not os.path.exists(path):
                os.makedirs(path)
            create_structure(path, content)
        else:
            # content is file content (empty string for now)
            with open(path, 'w') as f:
                f.write(content)

if __name__ == "__main__":
    if not os.path.exists(root):
        os.makedirs(root)
    create_structure(root, structure)
    print(f"Backend project structure created under './{root}'")

