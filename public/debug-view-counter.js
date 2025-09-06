// Debug helper for view counter
// Add this to browser console to test the API directly

async function testViewCounterAPI() {
  console.log('Testing View Counter API...');
  
  try {
    // Test GET request
    console.log('1. Testing GET request...');
    const getResponse = await fetch('/.netlify/functions/view-counter', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('GET Response status:', getResponse.status);
    
    if (getResponse.ok) {
      const getData = await getResponse.json();
      console.log('GET Response data:', getData);
    } else {
      const getError = await getResponse.text();
      console.error('GET Error:', getError);
    }
    
    // Test POST request
    console.log('2. Testing POST request...');
    const postPayload = {
      pageName: 'Test',
      visitorId: 'test_visitor_123',
      userAgent: navigator.userAgent,
      referrer: document.referrer,
      url: window.location.href,
      timestamp: new Date().toISOString()
    };
    
    const postResponse = await fetch('/.netlify/functions/view-counter', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(postPayload)
    });
    
    console.log('POST Response status:', postResponse.status);
    
    if (postResponse.ok) {
      const postData = await postResponse.json();
      console.log('POST Response data:', postData);
    } else {
      const postError = await postResponse.text();
      console.error('POST Error:', postError);
    }
    
  } catch (error) {
    console.error('Test failed:', error);
  }
}

// Usage: Run testViewCounterAPI() in browser console
console.log('To test the API, run: testViewCounterAPI()');
