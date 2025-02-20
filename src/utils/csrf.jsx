
export const getCsrfToken = async () => {
    try {
      const response = await fetch(baseurl + '/csrf-token', {
        method: 'GET',
        //credentials: 'include', // Include cookies for CSRF protection
      });
      const data = await response.json();
      console.log("data---->", data);
      // setcsrfTokenState(data.csrfToken); // Store the CSRF token in your state
      return data.csrfToken; // Return CSRF token for later use
    } catch (error) {
      console.error("Error fetching CSRF token", error);
      return null;
    }
  };