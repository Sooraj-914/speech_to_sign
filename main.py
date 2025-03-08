from flask import Flask, render_template, request, redirect, session, jsonify, Response
import requests
from flask_mysqldb import MySQL
import bcrypt

app = Flask(__name__)
app.secret_key = 'your_secret_key'

# Uncomment and configure your MySQL settings if needed
# app.config['MYSQL_HOST'] = 'localhost'
# app.config['MYSQL_USER'] = 'root'
# app.config['MYSQL_PASSWORD'] = 'your_password'
# app.config['MYSQL_DB'] = 'sign_language_db'

mysql = MySQL(app)

# Route: Home
@app.route('/')
def home():
    return render_template('home.html')

@app.route('/cwasa-proxy')
def cwasa_proxy():
    # Fetch the CWASA player content
    headers = {'Accept-Encoding': 'identity'}
    response = requests.get('https://vhg.cmp.uea.ac.uk/tech/jas/std/cwa/OneAvClient.html', headers=headersa)
    
    # Remove or modify the X-Frame-Options header
    headers = dict(response.headers)
    headers.pop('X-Frame-Options', None)  # Remove the X-Frame-Options header

    return Response(response.content, headers=headers)

# Route: Login
@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password'].encode('utf-8')
        cur = mysql.connection.cursor()
        cur.execute("SELECT password FROM users WHERE email = %s", (email,))
        user = cur.fetchone()
        cur.close()
        if user and bcrypt.checkpw(password, user[0].encode('utf-8')):
            session['email'] = email
            return redirect('/')
        return "Invalid credentials"
    return render_template('login.html')

# Route: Signup
@app.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        username = request.form['username']
        email = request.form['email']
        password = bcrypt.hashpw(request.form['password'].encode('utf-8'), bcrypt.gensalt())
        cur = mysql.connection.cursor()
        cur.execute("INSERT INTO users (username, email, password) VALUES (%s, %s, %s)", (username, email, password))
        mysql.connection.commit()
        cur.close()
        return redirect('/login')
    return render_template('signup.html')

# Route: Logout
@app.route('/logout')
def logout():
    session.pop('email', None)
    return redirect('/login')

@app.route('/feedback', methods=['GET', 'POST'])
def feedback():
    return render_template('feedback.html')

if __name__ == '__main__':
    app.run(debug=True)