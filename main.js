const videoElement = document.getElementById('video-element');
const startWebcamButton = document.getElementById('startWebcam');
const startScreenCaptureButton = document.getElementById('startScreenCapture');
const deviceListDropdown = document.getElementById('device-list');
const stopCaptureButton = document.getElementById('stopCapture');

let activeStream = null; // To keep track of the active stream

// Function to populate the device list
async function populateDeviceList() {
    try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoInputDevices = devices.filter(device => device.kind === 'videoinput');
        
        deviceListDropdown.innerHTML = ''; // Clear previous options

        videoInputDevices.forEach(device => {
            const option = document.createElement('option');
            option.value = device.deviceId;
            option.text = device.label || `Camera ${deviceInputDevices.indexOf(device) + 1}`;
            deviceListDropdown.appendChild(option);
        });
    } catch (error) {
        console.error('Error enumerating devices:', error);
    }
}

// Function to stop video capture
function stopCapture() {
    if (activeStream) {
        const tracks = activeStream.getTracks();
        tracks.forEach(track => track.stop());
        videoElement.srcObject = null;
        activeStream = null;
    }
}

// Function to start webcam video capture with the selected device
async function startWebcamCapture() {
    stopCapture(); // Stop any active capture first
    
    const selectedDeviceId = deviceListDropdown.value;
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { deviceId: selectedDeviceId } });
        videoElement.srcObject = stream;
        activeStream = stream; // Store the active stream
    } catch (error) {
        console.error('Error accessing webcam:', error);
    }
}

// Function to start screen capture
async function startScreenCapture() {
    stopCapture(); // Stop any active capture first
    
    try {
        const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        videoElement.srcObject = stream;
        activeStream = stream; // Store the active stream
    } catch (error) {
        console.error('Error accessing screen capture:', error);
    }
}

// Event listeners for buttons
startWebcamButton.addEventListener('click', startWebcamCapture);
startScreenCaptureButton.addEventListener('click', startScreenCapture);
stopCaptureButton.addEventListener('click', stopCapture);

// Initialize the device list
populateDeviceList();
