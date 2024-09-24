document.addEventListener('DOMContentLoaded', () => {
    const savedLanguage = localStorage.getItem('selectedLanguage') || 'en';
    const languageSelector = document.getElementById('language');

    if (languageSelector) {
        languageSelector.value = savedLanguage;
    }

    changeLanguage(savedLanguage);
});

function changeLanguage(lang) {
    console.log(`/set_language/?lang=${lang}`); // TMP DEBUG

	localStorage.setItem('selectedLanguage', lang);

    fetch(`/static/locales/${lang}.json`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(translations => {
            updatePageWithTranslations(translations);
            return fetch(`/set_language/?lang=${lang}`);
        })
        .then(response => response.json())
        .then(data => {
            if (data.status !== 'success') {
                console.error('Error setting language on server.');
            }
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}

function updatePageWithTranslations(translations) {
	// Generic
	const btnReturn = document.getElementById('btn-return');
	const backLink = document.getElementById('back-link');

	if (btnReturn) btnReturn.textContent = translations['btn-return'];
	if (backLink) backLink.textContent = translations['back-link'];

	// Index
	const mainTitle = document.getElementById('main-title');
	const playButtonActive = document.getElementById('play-button-active');
	const playButton = document.getElementById('play-button');
	const loginLink = document.querySelector('[onclick="toggleLoginForm()"]');
	const signUpLink = document.querySelector('[onclick="toggleSignupModal()"]');

	if (mainTitle) mainTitle.textContent = translations['main-title'];
	if (playButtonActive) playButtonActive.textContent = translations['play-button'];
	if (playButton) playButton.textContent = translations['play-button'];
	if (loginLink) loginLink.textContent = translations['log-in'];
	if (signUpLink) signUpLink.textContent = translations['sign-up'];

	// Registration modal
	const RegisterTitle = document.getElementById('signupModalLabel');
	// const RegisterMessages = document.getElementById('messages');
	const RegisterUsername = document.getElementById('RegisterUsername');
	const RegisterPassword = document.getElementById('RegisterPassword');
	const RegisterInstruction = document.getElementById('RegisterInstruction');
	const RegisterPasswordConf = document.getElementById('RegisterPasswordConf');
	const RegisterPP = document.getElementById('RegisterPP');
	const SignupBtn = document.getElementById('SignupBtn');

	if (RegisterTitle) RegisterTitle.textContent = translations['signupModalLabel'];
	// if (RegisterMessages) RegisterMessages.textContent = translations[''];
	if (RegisterUsername) RegisterUsername.textContent = translations['RegisterUsername'];
	if (RegisterPassword) RegisterPassword.textContent = translations['RegisterPassword'];
	if (RegisterInstruction) RegisterInstruction.textContent = translations['RegisterInstruction'];
	if (RegisterPasswordConf) RegisterPasswordConf.textContent = translations['RegisterPasswordConf'];
	if (RegisterPP) RegisterPP.textContent = translations['RegisterPP'];
	if (SignupBtn) SignupBtn.textContent = translations['SignupBtn'];

	// Modification Modals
	const changeUsernameTitle = document.getElementById('change-username-title');
	const newUsernameLabel = document.getElementById('new-username-label');
	const saveUsernameBtn = document.getElementById('save-username-btn');
	const changeAvatarTitle = document.getElementById('change-avatar-title');
	const profilePictureLabel = document.getElementById('profile-picture-label');
	const saveAvatarBtn = document.getElementById('save-avatar-btn');

	if (changeUsernameTitle) changeUsernameTitle.textContent = translations['change-username-title'];
	if (newUsernameLabel) newUsernameLabel.textContent = translations['new-username-label'];
	if (saveUsernameBtn) saveUsernameBtn.textContent = translations['save-username-btn'];
	if (changeAvatarTitle) changeAvatarTitle.textContent = translations['change-avatar-title'];
	if (profilePictureLabel) profilePictureLabel.textContent = translations['profile-picture-label'];
	if (saveAvatarBtn) saveAvatarBtn.textContent = translations['save-avatar-btn'];

	// Selection Page
	const localBtn = document.getElementById('local-btn');
	const tournamentBtn = document.getElementById('tournament-btn');
	const bombermanBtn = document.getElementById('bomberman-btn');
	const exitBtn = document.getElementById('exit-btn');

	if (localBtn) localBtn.textContent = translations['local-btn'];
	if (tournamentBtn) tournamentBtn.textContent = translations['tournament-btn'];
	if (bombermanBtn) bombermanBtn.textContent = translations['bomberman-btn'];
	if (exitBtn) exitBtn.textContent = translations['exit-btn'];

	// Sidebar
	const loginTitle = document.getElementById('login-title');
	const usernameLabel = document.getElementById('username-label');
	const passwordLabel = document.getElementById('password-label');
	const loginBtn = document.getElementById('login-btn');
	const form_separator = document.getElementById('form_separator');

	if (loginTitle) loginTitle.textContent = translations['login-title'];
	if (usernameLabel) usernameLabel.textContent = translations['username-label'];
	if (passwordLabel) passwordLabel.textContent = translations['password-label'];
	if (loginBtn) loginBtn.textContent = translations['login-btn'];
	if (form_separator) form_separator.textContent = translations['form_separator'];

	// Friend profile translations
    const pongGamesPlayed = document.getElementById('pong-games-played');
    const pongVictories = document.getElementById('pong-victories');
    const pongDefeats = document.getElementById('pong-defeats');
    const bbmGamesPlayed = document.getElementById('bbm-games-played');
    const bbmVictories = document.getElementById('bbm-victories');
    const bbmDefeats = document.getElementById('bbm-defeats');
    const bbmDraws = document.getElementById('bbm-draws');
    const connectionStatus = document.getElementById('connection-status');

    if (pongGamesPlayed) pongGamesPlayed.textContent = `${translations['pong-games-played']}: ${pongGamesPlayed.dataset.games}`;
    if (pongVictories) pongVictories.textContent = `${translations['pong-victories']}: ${pongVictories.dataset.victories}`;
    if (pongDefeats) pongDefeats.textContent = `${translations['pong-defeats']}: ${pongDefeats.dataset.defeats}`;
    if (bbmGamesPlayed) bbmGamesPlayed.textContent = `${translations['bbm-games-played']}: ${bbmGamesPlayed.dataset.games}`;
    if (bbmVictories) bbmVictories.textContent = `${translations['bbm-victories']}: ${bbmVictories.dataset.victories}`;
    if (bbmDefeats) bbmDefeats.textContent = `${translations['bbm-defeats']}: ${bbmDefeats.dataset.defeats}`;
    if (bbmDraws) bbmDraws.textContent = `${translations['bbm-draws']}: ${bbmDraws.dataset.draws}`;
    if (connectionStatus) connectionStatus.textContent = last_connection > 25 ? translations['connection-status-offline'] : translations['connection-status-online'];

	// Friend request translations
	const friendRequestsTitle = document.getElementById('friend-requests-title');
	const noFriendRequest = document.getElementById('no-friend-request');
	const acceptButton = document.getElementById('accept-button');
	const declineButton = document.getElementById('decline-button');

	if (friendRequestsTitle) friendRequestsTitle.textContent = translations['friend-requests-title'];
	if (noFriendRequest) noFriendRequest.textContent = translations['no-friend-request'];
	if (acceptButton) acceptButton.value = translations['accept-button'];
	if (declineButton) declineButton.value = translations['decline-button'];

	// Friends page translations
    const friendRequestsBtn = document.getElementById('friend-requests-btn');
    const addFriendPlaceholder = document.querySelector('input[name="friend_name"]');
    const addFriendBtn = document.getElementById('add-friend-btn');
    const friendsTitle = document.getElementById('friends-title');
    const noFriendsMessage = document.getElementById('no-friends-message');
    const viewProfileBtn = document.getElementById('view-profile-btn');

    if (friendRequestsBtn) friendRequestsBtn.value = translations['friend-requests-btn'];
    if (addFriendPlaceholder) addFriendPlaceholder.placeholder = translations['add-friend-placeholder'];
    if (addFriendBtn) addFriendBtn.value = translations['add-friend-btn'];
    if (friendsTitle) friendsTitle.textContent = translations['friends-title'];
    if (noFriendsMessage) noFriendsMessage.textContent = translations['no-friends-message'];
    if (viewProfileBtn) viewProfileBtn.value = translations['view-profile-btn'];

    // Game history page translations
    const gameHistoryTitle = document.getElementById('game-history-title');
    const noGamesFound = document.getElementById('no-games-found');

    if (gameHistoryTitle) gameHistoryTitle.textContent = translations['game-history-title'];
    if (noGamesFound) noGamesFound.textContent = translations['no-games-found'];

	// Profile page translations
    const profileTitle = document.getElementById('profile-title');
    const friendsBtn = document.getElementById('friends-btn');
    const localPongGames = document.getElementById('local-pong-games');
    const tournamentPongGames = document.getElementById('tournament-pong-games');
    const bombermanGames = document.getElementById('bomberman-games');
    const modifyUsernameBtn = document.getElementById('modify-username-btn');
    const logoutBtn = document.getElementById('btn-logout');

    if (profileTitle) profileTitle.textContent = translations['profile-title'];
    if (friendsBtn) friendsBtn.textContent = translations['friends-btn'];
    if (localPongGames) localPongGames.textContent = translations['local-pong-games'];
    if (tournamentPongGames) tournamentPongGames.textContent = translations['tournament-pong-games'];
    if (bombermanGames) bombermanGames.textContent = translations['bomberman-games'];
    if (modifyUsernameBtn) modifyUsernameBtn.textContent = translations['modify-username-btn'];
    if (logoutBtn) logoutBtn.textContent = translations['btn-logout'];

	// BOMBERMAN

	// game
	const exitButton = document.getElementById('btn-return');
	const resultButton = document.getElementById('result');

	if (exitButton) exitButton.textContent = translations['exit'];
	if (resultButton) resultButton.value = translations['result'];

	// player intro
	const colorSelectionTitle = document.getElementById('color-selection');
	const color1Label = document.getElementById('color1-label');
	const color2Label = document.getElementById('color2-label');
	const color1WhiteLabel = document.getElementById('color1-white-label');
	const color1BlackLabel = document.getElementById('color1-black-label');
	const color1RedLabel = document.getElementById('color1-red-label');
	const color1GreenLabel = document.getElementById('color1-green-label');
	const color1BlueLabel = document.getElementById('color1-blue-label');
	const color1YellowLabel = document.getElementById('color1-yellow-label');
	const color2WhiteLabel = document.getElementById('color2-white-label');
	const color2BlackLabel = document.getElementById('color2-black-label');
	const color2RedLabel = document.getElementById('color2-red-label');
	const color2GreenLabel = document.getElementById('color2-green-label');
	const color2BlueLabel = document.getElementById('color2-blue-label');
	const color2YellowLabel = document.getElementById('color2-yellow-label');
	const playButtonBBM = document.querySelector('input[name="playGame"]');
	const cancelButton = document.getElementById('btn-return');

	if (colorSelectionTitle) colorSelectionTitle.textContent = translations['color_selection'];
	if (color1Label) color1Label.textContent = translations['color1-label'];
	if (color2Label) color2Label.textContent = translations['color2-label'];
	if (playButtonBBM) playButtonBBM.value = translations['play'];
	if (cancelButton) cancelButton.textContent = translations['cancel'];
	if (color1WhiteLabel) color1WhiteLabel.textContent = translations['white'];
	if (color1BlackLabel) color1BlackLabel.textContent = translations['black'];
	if (color1RedLabel) color1RedLabel.textContent = translations['red'];
	if (color1GreenLabel) color1GreenLabel.textContent = translations['green'];
	if (color1BlueLabel) color1BlueLabel.textContent = translations['blue'];
	if (color1YellowLabel) color1YellowLabel.textContent = translations['yellow'];
	if (color2WhiteLabel) color2WhiteLabel.textContent = translations['white'];
	if (color2BlackLabel) color2BlackLabel.textContent = translations['black'];
	if (color2RedLabel) color2RedLabel.textContent = translations['red'];
	if (color2GreenLabel) color2GreenLabel.textContent = translations['green'];
	if (color2BlueLabel) color2BlueLabel.textContent = translations['blue'];
	if (color2YellowLabel) color2YellowLabel.textContent = translations['yellow'];


}
