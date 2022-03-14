const forwarderOrigin = 'http://localhost:9010';
const signButton = document.getElementById('signButton');
const signatureDiv = document.getElementById('signature');
const signerAddressDiv = document.getElementById('signerAddress');
const basicFunctionality = () => {
  //You will start here
  //Basic Actions Section
  const onboardButton = document.getElementById('connectButton');
  const accountsDiv = document.getElementById('accounts');

  //list of connected accounts
  let accounts = [];

  //We create a new MetaMask onboarding object to use in our app
  const onboarding = new MetaMaskOnboarding({forwarderOrigin});

  const isMetaMaskConnected = () => accounts && accounts.length > 0;

  //This will start the onboarding proccess
  const onClickInstall = () => {
    onboardButton.innerText = 'Onboarding in progress';
    onboardButton.disabled = true;
    signButton.disabled = true;
    //On this object we have startOnboarding which will start the onboarding process for our end user
    onboarding.startOnboarding();
  };

  const updateButtons = () => {
    if (!isMetaMaskInstalled()) {
      onboardButton.innerText = 'Click here to install MetaMask!';
      onboardButton.onclick = onClickInstall;
      onboardButton.disabled = false;
      signButton.disabled = true;
    } else if (isMetaMaskConnected()) {
      onboardButton.innerText = 'Connected';
      onboardButton.disabled = true;
      signButton.innerText = 'Sign & Send API Call';
      signButton.disabled = false;
      if (onboarding) {
        onboarding.stopOnboarding();
      }
    } else {
      onboardButton.innerText = 'Connect';
      onboardButton.onclick = onClickConnect;
      onboardButton.disabled = false;
      signButton.disabled = true;
    }
  };

  const onClickConnect = async () => {
    try {
      // Will open the MetaMask UI
      // You should disable this button while the request is pending!
      const newAccounts = await ethereum.request({
        method: 'eth_requestAccounts',
      });
      accounts = newAccounts;
      accountsDiv.innerHTML = accounts;
      updateButtons();
    } catch (error) {
      console.error(error);
    }
  };

  //Created check function to see if the MetaMask extension is installed
  const isMetaMaskInstalled = () => {
    //Have to check the ethereum binding on the window object to see if it's installed
    const {ethereum} = window;
    return Boolean(ethereum && ethereum.isMetaMask);
  };

  //------Inserted Code------\\
  const MetaMaskClientCheck = async () => {
    //Now we check to see if MetaMask is installed
    if (!isMetaMaskInstalled()) {
      //If it isn't installed we ask the user to click to install it
      onboardButton.innerText = 'Click here to install MetaMask!';
      //When the button is clicked we call this function
      onboardButton.onclick = onClickInstall;
      //The button is now disabled
      onboardButton.disabled = false;
    } else if (isMetaMaskConnected()) {
      onboardButton.innerText = 'Connected';
      onboardButton.disabled = true;
      if (onboarding) {
        onboarding.stopOnboarding();
      }
    } else {
      //If MetaMask is installed we ask the user to connect to their wallet
      onboardButton.innerText = 'Connect';
      //When the button is clicked we call this function to connect the users MetaMask Wallet
      onboardButton.onclick = onClickConnect;
      //The button is now disabled
      onboardButton.disabled = false;
    }
  };
  MetaMaskClientCheck();

  //------/Inserted Code------\\
};

const signMessage = async ({message}) => {
  try {
    console.log({message});
    if (!window.ethereum)
      throw new Error('No crypto wallet found. Please install it.');

    await window.ethereum.send('eth_requestAccounts');
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const signature = await signer.signMessage(message);
    const address = await signer.getAddress();

    return {
      message,
      signature,
      address,
    };
  } catch (err) {
    alert(err);
  }
};

const generateRandomValue = () => {
  const randomValue = Math.floor(Math.random() * 1000000);
  return randomValue;
};
const getTimeStamp = () => {
  const date = new Date();
  const unix = Math.floor(date.getTime() / 1000);
  return {unix, iso: date.toISOString()};
};
const postAPICall = ({timestamp, address, value, sign}) => {
  var myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');
  myHeaders.append('Accept', 'application/json');

  var raw = JSON.stringify({
    timestamp: timestamp,
    address: address,
    value: value,
    sign: sign,
  });

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow',
  };

  fetch('http://localhost:3000/metrics', requestOptions)
    .then(response => response.text())
    .then(result => alert('Success'))
    .catch(error => console.log('error', error));
};
const initialize = async () => {
  //This is the function that will be called when the page loads
  basicFunctionality();

  const randomValueDiv = document.getElementById('randomValue');
  const timeStampDiv = document.getElementById('timeStamp');
  const randomValue = generateRandomValue();
  const {unix, iso} = getTimeStamp();
  // get random value and timestamp and assign to div
  randomValueDiv.innerHTML = randomValue;
  timeStampDiv.innerHTML = iso;

  const concatedMessage = randomValue.toString().concat(unix.toString());

  signButton.onclick = async () => {
    const {message, signature, address} = await signMessage({
      message: concatedMessage,
    });
    signatureDiv.innerHTML = signature;
    signerAddressDiv.innerHTML = address;
    postAPICall({timestamp: iso, address, value: randomValue, sign: signature});
  };
};

window.addEventListener('DOMContentLoaded', initialize);
