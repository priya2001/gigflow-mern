// Function to emit notification to a specific user
const sendNotification = (userId, notificationType, data) => {
  if (global.io) {
    // Emit to the specific user's room
    global.io.to(userId.toString()).emit('notification', {
      type: notificationType,
      data,
      timestamp: new Date()
    });
  }
};

// Function to notify freelancer when hired
const notifyFreelancerHired = (freelancerId, gigTitle) => {
  sendNotification(freelancerId, 'HIRED_NOTIFICATION', {
    message: `You have been hired for "${gigTitle}"!`,
    gigTitle
  });
};

// Function to notify client when new bid is received
const notifyClientNewBid = (clientId, bidData) => {
  sendNotification(clientId, 'NEW_BID_NOTIFICATION', {
    message: `New bid received for your gig`,
    bidData
  });
};

export { sendNotification, notifyFreelancerHired, notifyClientNewBid };