import { apiBaseUrl } from '../../../shared/config/env.js';

export async function loginRequest(username, password) {
  console.log('🔐 Attempting login for:', username);
  console.log('📍 API Base URL:', apiBaseUrl);
  
  try {
    const url = `${apiBaseUrl}/api/auth/login`;
    console.log('🌐 Calling:', url);

    const response = await fetch(url, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ username, password })
    });

    console.log('📊 Response Status:', response.status);
    console.log('📋 Response Headers:', {
      'content-type': response.headers.get('content-type'),
      'content-length': response.headers.get('content-length')
    });

    // Get response text first
    const responseText = await response.text();
    console.log('📝 Raw Response:', responseText.substring(0, 200));

    // Try to parse as JSON
    let data;
    try {
      data = JSON.parse(responseText);
      console.log('✅ Successfully parsed JSON');
    } catch (parseError) {
      console.error('❌ Failed to parse JSON:', parseError.message);
      console.error('Response was:', responseText.substring(0, 500));
      throw new Error('Server returned invalid JSON response');
    }

    // Check if request was successful
    if (!response.ok) {
      console.error('❌ API returned error status:', response.status);
      const errorMessage = data?.error?.message || data?.message || `Server error: ${response.status}`;
      throw new Error(errorMessage);
    }

    // Extract data from wrapper if needed
    console.log('📦 Response data structure:', Object.keys(data));
    const responseData = data?.data || data;
    
    console.log('🔍 Extracted data keys:', Object.keys(responseData || {}));

    // Validate response has required fields
    if (!responseData?.accessToken) {
      console.error('❌ Missing accessToken in response');
      console.error('Response structure:', responseData);
      throw new Error('Invalid response: Missing access token');
    }

    console.log('✅ Login request successful!');
    return responseData;
  } catch (error) {
    console.error('💥 Login request error:', error);
    throw error;
  }
}

export async function logoutRequest(accessToken, refreshToken) {
  if (!accessToken) {
    return;
  }

  await fetch(`${apiBaseUrl}/api/auth/logout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`
    },
    body: JSON.stringify({ refreshToken })
  });
}
