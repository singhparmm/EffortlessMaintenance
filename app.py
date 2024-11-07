from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_login import LoginManager, UserMixin, login_user, logout_user, login_required, current_user
from flask_cors import CORS
from datetime import timedelta

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'
app.config['SECRET_KEY'] = 'supersecretkey'
app.config['REMEMBER_COOKIE_DURATION'] = timedelta(days=7)  # Extend session for 7 days

db = SQLAlchemy(app)
bcrypt = Bcrypt(app)
login_manager = LoginManager(app)
login_manager.login_view = 'login'
CORS(app, supports_credentials=True)  # Support credentials for cross-origin requests

# Define User model
class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(150), nullable=False)
    last_name = db.Column(db.String(150), nullable=False)
    email = db.Column(db.String(150), unique=True, nullable=False)
    password = db.Column(db.String(256), nullable=False)

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

# API for sign up (remains the same)
@app.route('/api/signup', methods=['POST'])
def signup():
    try:
        data = request.get_json()
        email = data.get('email')
        first_name = data.get('first_name')
        last_name = data.get('last_name')
        password = data.get('password')
        retype_password = data.get('retype_password')

        # Check if email already exists
        if User.query.filter_by(email=email).first():
            return jsonify({"message": "Email already exists"}), 409

        # Check if passwords match
        if password != retype_password:
            return jsonify({"message": "Passwords do not match"}), 400

        # Hash the password and save user
        hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
        new_user = User(first_name=first_name, last_name=last_name, email=email, password=hashed_password)
        db.session.add(new_user)
        db.session.commit()

        return jsonify({"message": "User registered successfully"}), 201

    except Exception as e:
        print(f"Error during signup: {str(e)}")
        return jsonify({"message": "Internal Server Error"}), 500

# API for login with better logging
@app.route('/api/login', methods=['POST'])
def login():
    try:
        data = request.get_json()

        if not data:
            print("No data received in login request")  # Debug log for missing data
            return jsonify({"message": "No data provided"}), 400

        email = data.get('email')
        password = data.get('password')

        # Check if fields are missing
        if not email or not password:
            print("Email or password missing from request data")
            return jsonify({"message": "Email and password required"}), 400

        # Fetch user by email
        user = User.query.filter_by(email=email).first()
        if not user:
            print(f"User not found for email: {email}")  # Log when user is not found
            return jsonify({"message": "Invalid credentials"}), 401

        # Check if password matches
        if not bcrypt.check_password_hash(user.password, password):
            print(f"Incorrect password for user: {email}")  # Log for incorrect password
            return jsonify({"message": "Invalid credentials"}), 401

        # Log the user in
        login_user(user, remember=True)
        print(f"Login successful for user: {email}")
        return jsonify({"message": "Login successful", "user": user.email, "first_name": user.first_name}), 200

    except Exception as e:
        print(f"Error during login: {str(e)}")  # Log detailed error on backend
        return jsonify({"message": "Internal Server Error"}), 500
    

# API to check if user is logged in
@app.route('/api/check-login', methods=['GET'])
@login_required
def check_login():
    return jsonify({"user": current_user.email, "first_name": current_user.first_name}), 200

# API for logout
@app.route('/api/logout', methods=['POST'])
@login_required
def logout():
    logout_user()
    return jsonify({"message": "Logout successful"}), 200

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
