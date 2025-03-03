// Refresh TikTok access token
router.get("/tiktok/refresh-token", async (req, res) => {
    // Get userId from session
    const userId = req.session.userId;
    
    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }
    
    try {
      // Get user data from Firestore
      const userRef = db.collection("users").doc(userId);
      const userDoc = await userRef.get();
      
      if (!userDoc.exists) {
        return res.status(404).json({ error: "User not found" });
      }
      
      const userData = userDoc.data();
      const { refreshToken, tokenExpiry } = userData;
      
      // Check if token is not expired yet
      const now = admin.firestore.Timestamp.now();
      if (tokenExpiry && tokenExpiry.toMillis() > now.toMillis()) {
        // Token is still valid, just return current user
        return res.json({
          success: true,
          user: {
            id: userId,
            username: userData.username,
            displayName: userData.displayName,
            profilePicture: userData.profilePicture
          }
        });
      }
      
      // Token is expired, refresh it
      const refreshResponse = await axios.post(
        "https://open-api.tiktok.com/oauth/refresh_token/", 
        null,
        {
          params: {
            client_key: TIKTOK_CLIENT_KEY,
            grant_type: "refresh_token",
            refresh_token: refreshToken
          }
        }
      );
      
      const { 
        access_token: newAccessToken, 
        refresh_token: newRefreshToken, 
        expires_in 
      } = refreshResponse.data.data;
      
      // Calculate new expiration date
      const newTokenExpiry = new Date();
      newTokenExpiry.setSeconds(newTokenExpiry.getSeconds() + expires_in);
      
      // Update user in Firestore
      await userRef.update({
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        tokenExpiry: admin.firestore.Timestamp.fromDate(newTokenExpiry),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
      
      // Return success
      res.json({
        success: true,
        user: {
          id: userId,
          username: userData.username,
          displayName: userData.displayName,
          profilePicture: userData.profilePicture
        }
      });
      
    } catch (error) {
      console.error("Token refresh error:", error.response?.data || error.message);
      
      // Check if refresh token is invalid
      if (error.response?.data?.data?.description === "refresh token is invalid") {
        // Force re-authentication
        req.session.destroy();
        return res.status(401).json({ 
          error: "Refresh token invalid", 
          reauth: true 
        });
      }
      
      res.status(500).json({
        error: "Failed to refresh token",
        details: error.response?.data || error.message
      });
    }
  });