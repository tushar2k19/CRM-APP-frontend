<template>
  <div class="right-panel" v-if="conversation"><br><br>
    <h3>Notes for {{ conversation.name }}</h3>
    <div class="notes-section">
      <textarea class = "add-notes-area" v-model="newNote" placeholder="Add notes..."></textarea>
      <button class="button" v-disabled="!newNote" @click="handleAddNote">Save</button>
    </div>
    <h3>Existing Notes</h3>
    <div class="notes-container" v-if="notes.length > 0">
      <div class="notes-list">
        <div class="note-item" v-for="note in notes" :key="note.id">
          <p class="note-content">{{ note.content }}</p>
          <span class="note-time">{{ note.createdAt }}</span>
        </div>
      </div>
    </div>
    <p v-if="!notes.length">No notes found.</p>
  </div>
</template>

<script>
export default {
  props: {
    conversation: Object
  },
  data () {
    return {
      newNote: '',
      notes: []
    }
  },
  mounted () {
    this.fetchNotes(this.conversation.id)
  },
  watch: {
    conversation: {
      handler (newVal, oldVal) {
        this.fetchNotes()
      },
      deep: true,
      immediate: true
    }
  },

  methods: {
    async fetchNotes (conversationId) {
      this.$http.secured.get('/notes',
        {
          params: {
            conversation_id: this.conversation.id
          }
        })
        .then(response => {
          this.notes = response.data.data.reverse()
        })
    },
    handleAddNote () {
      this.$http.secured.post('/new_note', {
        conversation_id: this.conversation.id,
        note: this.newNote
      })
        .then(response => {
          alert('Note Saved')
          this.newNote = ''
          this.fetchNotes(this.conversation.id)
        })
    }
  }
}
</script>

<style scoped>
.right-panel {
  padding: 1rem;
  border-radius: 4px;
  background-color: #f5f5f5;
  height: 93vh;
}

.button {
  margin-top: 15px;
  padding: 8px 16px;
  border: 1px solid #ddd;
  background-image: linear-gradient(to right, #2c6df8, #51a0fa);
  color: #FFFF;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

.notes-section {
  display: flex;
  align-items: center;
  margin-bottom: -7px;
  margin-top: -20px;
}
.add-notes-area{
  width: calc(100% - 100px);
  margin-right: 15px;
  margin-top: 15px;
  height: 65px;
}

.notes-container {
  height: 350px;
  overflow-y: auto;
}

.notes-list {
  margin: 0;
  padding: 0;
  list-style: none;
}

.note-item {
  display: flex;
  flex-direction: column;
  padding: 1rem;
  border-bottom: 1px solid #eee;
  margin-bottom: 0.5rem;
  background-color: #fff;
  border-radius: 4px;
}

.note-content {
  font-size: 0.9rem;
  line-height: 1.5;
  background-color: #E6F2FF;
  border-radius: 4px;
  padding: 5px;
}

.note-time {
  font-size: 0.8em;
  color: black;
}
</style>
