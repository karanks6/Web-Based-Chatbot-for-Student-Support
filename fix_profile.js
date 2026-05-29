
const updateProfile = async () => {
    try {
        // 1. Login
        console.log("Logging in...");
        const loginRes = await fetch('http://localhost:8080/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: 'demo1', password: 'password' })
        });

        if (!loginRes.ok) throw new Error(`Login failed: ${loginRes.statusText}`);
        const loginData = await loginRes.json();
        const token = loginData.token;
        console.log("Got token.");

        // 2. Update Profile
        console.log("Updating profile...");
        const start = Date.now();
        const updateRes = await fetch('http://localhost:8080/api/user/profile', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                email: 'demo1@student.com'
            })
        });


        const fs = require('fs');
        fs.writeFileSync('success.txt', 'Profile updated successfully');
        console.log("Profile updated successfully:", updateData);

    } catch (e) {
        console.error("Script failed:", e);
        const fs = require('fs');
        fs.writeFileSync('error.txt', JSON.stringify(e.message));
    }
};

updateProfile();
