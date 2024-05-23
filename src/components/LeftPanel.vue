<template>
  <div class="left-panel">
    <div class="search-container">
      <input
        type="text"
        v-model="searchText"
        placeholder="Search Conversations..."
        class="search-input"
        @keyup.enter="onSearch"
      />
      <div>
        <div v-if="!searchClicked"><button class="search-button" @click="onSearch">Search</button></div>
        <div v-else><button class="search-button" @click="onReset">Reset</button></div>
      </div>
    </div>
    <div class="conversation-list">
      <div
        v-for="conversation in conversations"
        :key="conversation.id"
        @click="handleConversationClick(conversation)"
        class="conversation-item"
      >
        <div class="conversation-info">
          <div class="conversation-name-and-time">
            <div class="conversation-name">{{ conversation.name }}</div>
            <div class="sent-time" v-if="conversation.last_message">
              {{ conversation.sent_time }}
            </div>
          </div>
          <div class="conversation-message">
            <span v-if="conversation.last_message">
              {{ getTruncatedMessage(conversation.last_message) }}
            </span>
            <span v-else>Start a new Conversation</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {bus} from '../main'
export default {
  name: 'LeftPanel',
  props: {},
  data () {
    return {
      conversations: [],
      conversations_copy: [],
      searchText: '',
      isResetActive: false,
      searchClicked: false
    }
  },
  async mounted () {
    await this.fetchConversations()
    this.conversations_copy = this.conversations
  },
  updated () {
    bus.$on('new-message', this.fetchConversations)
  },
  methods: {
    fetchConversations () {
      this.$http.secured.get('/conversation')
        .then(response => {
          this.conversations = response.data.conversations
        })
    },
    handleConversationClick (conversation) {
      this.searchText = ''
      this.$emit('conversation-selected', conversation)
    },
    onSearch () {
      this.$http.secured.get('/conversation/search',
        {
          params: {name: this.searchText}
        })
        .then(response => {
          this.conversations = response.data.conversation
          this.searchClicked = true
        }).catch(e => {
          console.log('inside error', e)
        })
    },
    onReset () {
      this.searchClicked = false
      this.searchText = ''
      this.fetchConversations()
    },
    getTruncatedMessage (message) {
      if (message.length > 25) {
        return message.slice(0, 25) + '...'
      }
      return message
    }
  },
  computed: {
    // filteredConversations() {
    //   if (this.searchText) {
    //     return this.conversations.filter((conversation) =>
    //       conversation.name.toLowerCase().includes(this.searchText.toLowerCase())
    //     );
    //   } else {
    //     return this.conversations;
    //   }
    // },
  }
}

</script>

<style scoped>
.left-panel {
  margin-top: 7%;
  border-radius: 4px;
  background-color: #E6F2FF;

  height: 88vh;
}

.search-container {
  display: flex;
  align-items: center;
  margin-bottom: 0;
}
.search-input {
  padding: 0.5rem;
  width: 70%;
  border: 1px solid #ccc;
  border-radius: 4px;
  transition: border-color 0.3s ease-in-out;
}

.search-button{
  margin-top: 0;
  padding: 6px 8px;
  border: 1px solid #ddd;
  background-image: linear-gradient(to right, #2c6df8, #51a0fa);
  color: #FFFF;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.3s ease;
  font-size: smaller;
}

.search-input:focus {
  outline: none;
  border-color: dodgerblue;
}

.conversation-list {
  margin: 0;
  padding: 0;
  list-style: none;
  overflow-y: auto;
  max-height: 84.2vh;
}

.conversation-item {
  display: flex;
  padding: 1rem;
  border-bottom: 1px solid #eee;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;
}

.conversation-item:hover {
  background-color: #2C4E80;
  color:whitesmoke;
}

.conversation-info {
  flex: 1;
}

.conversation-name-and-time {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.sent-time {
  margin-left: 1rem;
  color: #888;
  font-size: 14px;
}

.conversation-message {
  font-size: 0.8rem;
  color: #888;
}
</style>
