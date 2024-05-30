<template>
  <div class="center-panel" v-if="conversation"><br><br>
    <div class="chat-header">
      <h3>Conversation with {{ conversation.name }}</h3>
    </div>
    <div class="chat-history-container" ref="chatHistory">
      <div class="chat-message" v-for="message in messages" :key="message.id" @click="selectMessage(message.id)" :class="{ 'selected': message.id === selectedMessage }">
        <div class="message-sender">
          <span style=" font-weight: 12;">{{ message.senderName || 'Admin' }}</span>
          <span class="message-time">{{ message.sentAt }}</span>
        </div>
        <p class="message-content">{{ message.content }}</p>
      </div>
    </div>
    <div class="message-composer" style="margin-top: -20px">
      <textarea class="chat-area" v-model="newMessage" :maxlength="300" placeholder="Type your message..." @keyup.enter="handleSendMessage"></textarea>
      <button class="button" v-disabled="!newMessage || newMessage.length === 0" @click="handleSendMessage">Send</button>
      <span v-if="newMessage.length > 300" class="error-message">Message exceeds character limit (300 characters)</span>
    </div>
  </div>
</template>

<script>
import {bus} from '../main.js'
export default {
  props: {
    conversation: Object
  },
  data () {
    return {
      newMessage: '',
      messages: [],
      conv_id: -1,
      temp_msg: '',
      selectedMessage: null
    }
  },
  mounted () {
    this.fetchMessages()
    this.$nextTick(() => {
      this.$refs.chatHistory.scrollTop = this.$refs.chatHistory.scrollHeight
    })
  },
  updated () {
    this.$refs.chatHistory.scrollTop = this.$refs.chatHistory.scrollHeight
  },
  watch: {
    conversation: {
      handler (newVal, oldVal) {
        this.fetchMessages()
      },
      deep: true,
      immediate: true
    },
    messages: {
      handler () {
        this.scrollToBottom()
      },
      deep: true
    }
  },
  methods: {
    selectMessage (messageId) {
      this.selectedMessage = messageId
    },
    fetchMessages () {
      this.newMessage = ''
      this.$http.secured.get('/conversation_messages',
        {
          params: {
            conversation_id: this.conversation.id
          }
        })
        .then(response => {
          this.messages = response.data.messages
        })
    },
    handleSendMessage () {
      this.temp_msg = this.newMessage
      this.newMessage = ''
      this.$http.secured.post('/conversation_messages/send',
        {
          conversation_id: this.conversation.id,
          message: this.temp_msg
        })
        .then(async response => {
          await bus.$emit('new-message')
          this.fetchMessages()
        }).catch(e => {
          this.newMessage = ''
          alert('OOPS!! Something Went Wrong.')
        })
    },
    scrollToBottom () {
      this.$refs.chatHistory.scrollTop = this.$refs.chatHistory.scrollHeight
    }
  }
}
</script>

<style scoped>
.message-composer {
  display: flex;
  align-items: center;
  padding: 50px;
  width: 100%;
  padding-left: 0px;
}

.message-time {
  font-size: 0.8em;
  color: black;
  padding-right: 5px;
}
.message-content {
  background-color: #E6F2FF;
  padding: 1rem;
  border-radius: 4px;
}
.message-sender {
  color: Black;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.error-message {
  color: red;
  font-size: 0.8em;
  margin-top: 5px;
}
.center-panel {
  padding: 1rem;
  border-radius: 4px;
  background-color: #f5f5f5;
  height: 93vh;
  min-width: 570px;
}

.chat-header {
  padding-bottom: 1rem;
  border-bottom: 1px solid #eee;
}

.chat-history-container {
  margin-top: -23px;
  height: calc(100vh - 250px);
  overflow-y: auto;
}

.chat-message {
  display: flex;
  flex-direction: column;
  padding: 1rem;
  border-bottom: 1px solid #eee;
  margin-bottom: 0.5rem;
  background-color: #fff;
  border-radius: 4px;
}
.message-content {
  font-size: 0.9rem;
  line-height: 1.5;
}

.error-message {
  color: red;
  font-size: 0.8em;
  margin-top: 5px;
}
.chat-area {
  width: calc(100% - 100px);
  height: 60px;
  margin-right: 15px;
}
.chat-area::placeholder {
  font-size: 16px;
}
.button {
  appearance: none;
  outline: none;
  border: none;
  background: none;
  cursor: pointer;

  display: inline-block;
  padding: 8px 12px;
  background-image: linear-gradient(to right, #2c6df8, #51a0fa);
  border-radius: 8px;

  color: #FFF;
  font-size: 14px;
  font-weight: 700;

  box-shadow: 3px 3px rgba(0, 0, 0, 0.4);
  transition: 0.4s ease-out;

  &:hover {
    box-shadow: 6px 6px rgba(0, 0, 0, 0.6);
  }
}
</style>
