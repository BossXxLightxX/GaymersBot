const EventEmitter = require('events');
const Discord = require('discord.js');
const CommandHandler = require('./CommandHandler')
const MessageHandler = require('./MessageHandler');
const ReactionHandler = require('./ReactionHandler');

class Bot extends EventEmitter {
  /**
   * Initializes all modules, a Discord client, binds events.
   * @constructor
   */
  constructor() {
    super();
    this.client = new Discord.Client();
    this.CommandHandler = new CommandHandler(this)
    this.MessageHandler = new MessageHandler(this);
    this.ReactionHandler = new ReactionHandler(this);
    this.bindEvents();
  }

  /**
   * Bind event functions.
   */
  bindEvents() {
    this.client.on('ready', this.onReady.bind(this));
    this.client.on('message', this.onMessage.bind(this));
    this.client.on('messageReactionAdd', this.onMessageReactionAdd.bind(this));
    this.client.on('messageReactionRemove', this.onMessageReactionRemove.bind(this));
  }

  /**
   * Login client to Discord.
   */
  connect() {
    this.client.login(process.env.AUTH_TOKEN);
  }

  /**
   * Destroy Discord client.
   */
  destroy() {
    console.log(`Shutting down.`);
    this.client.destroy();
  }

  /**
   * Passes message events to the MessageHandler.
   * @param {Message} Message The Discord message object.
   */
  async onMessage(Message) {
    this.MessageHandler.handleMessage(Message);
  }

  /**
   * Passes reaction add events to the ReactionHandler.
   * @param {Reaction} Reaction The Discord reaction object.
   * @param {User} User The Discord user that added the reaction.
   */
  async onMessageReactionAdd(Reaction, User) {
    this.ReactionHandler.handleReaction('ADD', Reaction, User);
  }

  /**
   * Passes reaction remove events to the ReactionHandler.
   * @param {Reaction} Reaction The Discord reaction object.
   * @param {User} User The Discord user that removed the reaction.
   */
  async onMessageReactionRemove(Reaction, User) {
    this.ReactionHandler.handleReaction('REMOVE', Reaction, User);
  }

  /**
   * Bot is connected to Discord.
   */
  onReady() {
    console.log(`Connected to Discord as ${this.client.user.username}#${this.client.user.discriminator} <@${this.client.user.id}>`);
  }
}

module.exports = Bot;
