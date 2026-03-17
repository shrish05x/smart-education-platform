async function testRegister() {
  try {
    const res = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test Mentor',
        email: `mentor${Date.now()}@example.com`,
        password: 'Password123!',
        role: 'mentor',
        university: 'Test University'
      })
    });
    const data = await res.json();
    console.log('Status:', res.status);
    console.log('Response:', data);
  } catch (err) {
    console.error('Registration failed:', err);
  }
}

testRegister();
