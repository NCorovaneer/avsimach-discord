const {getAnimeGif, getGif} = require('./imgur');
const {comparePlanes} = require('./jetchart-index');
const animeRegexp = require('../utils/anime-regexp');

const COMPARE_REGEX = /([M|F|S|A]\S*)\sи\s([M|F|S|A]\S*)/gi;
const SHOW_REGEX = /покажи\s(.*)$/gi;
const MEMES_LIMIT = 3;
const HOME_ID = '444034088429551619';

let memesCount = 0;
let memesInterval = setInterval(() => {
	memesCount = 0;
}, 60000 * 65);

const MESSAGES = {
	buddy: {
		pattern: /дружок|дружочек/gi,
		reply: message => {
			message.reply('пирожочек')
		}
	},
	chack: {
		pattern: /чак/gi,
		reply: message => {
			message.reply({file: 'https://cdn.discordapp.com/attachments/444034088429551619/466315013607522304/5b168d61ee2cc163d01846b8.png'})
		}
	},
	hmd: {
		pattern: /nashlem|нашлем/gi,
		reply: message => {
			message.reply({file: 'https://i.imgur.com/7FHoSIG.png'})
		}
	},
	anime: {
		pattern: animeRegexp,
		reply: message => {
			if (Boolean(Math.floor(Math.random() * 2))) {
				getAnimeGif(message);
			}
		}
	},
	findGif: {
		pattern: /начальник, покажи|начальник покажи/gi,
		reply: message => {
			if (memesCount >= MEMES_LIMIT) {
				message.reply('талоны на мемы закончились, ждите новых');

				console.log('memesCount >', memesCount, 'MEMES_LIMIT >', MEMES_LIMIT);

				return;
			}

			memesCount++;

			if (MEMES_LIMIT - memesCount === 1) {
				message.guild.channels.get(HOME_ID).send('остался один талон на один мем');
			}

			message.content.match(SHOW_REGEX);

			const query = RegExp.$1;

			getGif(message, query);
		}
	},
	infa: {
		pattern: /60\/40/gi,
		reply: message => {
			_checkInfa(message)
		}
	},
	egg: {
		pattern: /egg|пожел|пожил|еггп|баклажан|эгг|егп/gi,
		reply: message => {
			message.react('🍆');
		}
	},
	compare: {
		pattern: /начальник, сравни|начальник сравни/gi,
		reply: message => {
			message.content.match(COMPARE_REGEX);

			const firstPlane = RegExp.$1;
			const secondPlane = RegExp.$2;

			if (!firstPlane || !secondPlane) {
				message.reply('чет ничего не сматчилось, попробуй еще');

				return;
			}

			comparePlanes(firstPlane, secondPlane)
				.then(compareMessage => {
					message.reply(compareMessage);
				})
				.catch(error => {
					console.log(error);

					message.reply('что-то сломалось');
				});
		}
	}
};

function _checkInfa(message) {
	const channel = message.guild.channels.get(HOME_ID);

	message.reply('Проверяю инфу...');

	setTimeout(() => {
		channel.send('Проверил. ' + (Math.floor(Math.random() * 10) > 5
			? 'Инфа ложная'
			: 'Инфу подтверждаю'));
	}, 5000);
}

module.exports = MESSAGES;
