// Fonction pour récupérer et traiter le JSON
function fetchJSON(url) {
    // Récupérer le JSON à partir de l'URL fournie
    fetch(url)
    //then est une méthode qui retourne une promesse et prend en paramètre une
        //fonction callback qui sera exécutée une fois la promesse résolue
        .then(response => {
            // Vérifier si la réponse est correcte
            if (!response.ok) {
                    // Si la réponse n'est pas correcte, lancer une erreur
                throw new Error('Network response was not ok');
            }
                    // Si la réponse est correcte, retourner le JSON
                return response.json();
        })
        //then ici permettra de récupérer le JSON retourné par la promesse
        .then(data => {
            // Vérifier si le JSON est vide ou mal formé
            if (Object.keys(data).length === 0 && data.constructor === Object) {
                    // Si le JSON est vide ou mal formé, lancer une erreur
                throw new Error('Empty JSON or malformed JSON');
            }//On affiche le JSON dans la console. Il s'agit d'un objet contenant les
            // intentions du chatbot
        console.log(data);
        // Passer les intentions à la fonction sendMessage qui sera définie plus tard
        sendMessage(data.intents);
        })
        //catch est une méthode qui retourne une promesse et prend en paramètre une
        //fonction callback qui sera exécutée en cas d’erreur
        .catch(error => {
        // En cas d’erreur, afficher un message d’erreur dans la console
        console.error("There was a problem with the fetch operation:", error);
        }) ;
    }

function showMessage(message, type) {
    const chatBox = document.getElementById('chat-box');
 
    // Créer une bulle de message
    const msgDiv = document.createElement('div');
    msgDiv.classList.add(type === 'user' ? 'msg-user' : 'msg-bot');
    msgDiv.textContent = message;
 
    chatBox.appendChild(msgDiv);
 
    // Faire défiler automatiquement vers le bas
    chatBox.scrollTop = chatBox.scrollHeight;
 
    // Sauvegarder dans l'historique
    historyMessages.addMessage({ message: message, sender: type });
}

function processMessage(intents, message) {
    // Réponse par défaut
    let response = "Je suis désolé, je ne suis pas sûr de comprendre.";
 
    // Parcourir les intentions
    intents.forEach(intent => {
        intent.patterns.forEach(pattern => {
            if (message.toLowerCase().includes(pattern.toLowerCase())) {
                // Sélectionner une réponse aléatoire parmi les réponses possibles
                response = intent.responses[Math.floor(Math.random() * intent.responses.length)];
            }
        });
    });
 
    return response;
}

function sendMessage(intents) {
    // a. Récupération de la saisie utilisateur
    const userInput = document.getElementById('user-input');
    const messageUser = userInput.value.trim();
 
    // Ne rien faire si le champ est vide
    if (messageUser === '') return;
 
    // b. Affichage du message de l'utilisateur dans le chat
    showMessage(messageUser, 'user');
 
    // c. Traitement du message et obtention de la réponse
    const botResponse = processMessage(intents, messageUser);
 
    // d. Affichage de la réponse du bot avec un léger délai
    setTimeout(function () {
        showMessage(botResponse, 'bot');
    }, 400);
 
    // e. Effacer le champ de saisie
    userInput.value = '';
}

// 1 & 2 - Classe ChatHistory avec constructeur initialisant le tableau messages
class ChatHistory {
    constructor() {
        this.messages = [];
    }

    // 3 - Méthode addMessage qui ajoute un message à la fin du tableau
    addMessage(message) {
        this.messages.push(message);
    }

    // 4 - Méthode getHistory qui retourne le tableau messages
    getHistory() {
        return this.messages;
    }
}

// Instanciation de la classe ChatHistory
const historyMessages = new ChatHistory();

// 5 - Sauvegarde des messages avant de quitter la page
function saveMessages() {
    console.log('Saving chat history...');
    console.log(historyMessages.getHistory());
    sessionStorage.setItem('chatHistory', JSON.stringify(historyMessages.getHistory().map(msg => msg.message)));
}

// 6 - Chargement des messages au chargement de la page
function loadMessages() {
    const chatHistory = JSON.parse(sessionStorage.getItem('chatHistory'));
    if (chatHistory) {
        chatHistory.forEach(message => {
            showMessage(message, message.sender);
        });
    }
}

// 5 - Enregistrement des messages avant de quitter la page
window.addEventListener('beforeunload', saveMessages);

// 6 - Chargement des messages au chargement de la page
window.addEventListener('load', loadMessages);

// -------------------------------------------------------
// Fonctions existantes
// -------------------------------------------------------

function fetchJSON(url) {
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (Object.keys(data).length === 0 && data.constructor === Object) {
                throw new Error('Empty JSON or malformed JSON');
            }
            console.log(data);
            sendMessage(data.intents);
        })
        .catch(error => {
            console.error("There was a problem with the fetch operation:", error);
        });
}

function showMessage(message, type) {
    const chatBox = document.getElementById('chat-box');

    const msgDiv = document.createElement('div');
    msgDiv.classList.add(type === 'user' ? 'msg-user' : 'msg-bot');
    msgDiv.textContent = message;

    chatBox.appendChild(msgDiv);
    chatBox.scrollTop = chatBox.scrollHeight;

    // Sauvegarde dans l'historique
    historyMessages.addMessage({ message: message, sender: type });
}

function processMessage(intents, message) {
    let response = "Je suis désolé, je ne suis pas sûr de comprendre.";

    intents.forEach(intent => {
        intent.patterns.forEach(pattern => {
            if (message.toLowerCase().includes(pattern.toLowerCase())) {
                response = intent.responses[Math.floor(Math.random() * intent.responses.length)];
            }
        });
    });

    return response;
}

function sendMessage(intents) {
    const userInput = document.getElementById('user-input');
    const messageUser = userInput.value.trim();

    if (messageUser === '') return;

    showMessage(messageUser, 'user');

    const botResponse = processMessage(intents, messageUser);

    setTimeout(function () {
        showMessage(botResponse, 'bot');
    }, 400);

    userInput.value = '';
}