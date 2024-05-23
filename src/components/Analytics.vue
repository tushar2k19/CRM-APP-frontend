<template>
  <div class="analytics-container">
    <br><br><br>
    <h2 style="color: #2C4E80">Analytics</h2>
    <div class="stats-row">
      <div v-for="(stat, index) in stats" :key="index" class="stat-container">
        <div class="stat-item animated-box">
          <h3>{{ stat.title }}</h3>
          <p>{{ stat.value }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      stats: [
        { title: 'Total Contacts', value: 0 },
        { title: 'Contacts (Last 7 Days)', value: 0 },
        { title: 'Conversations (Last 7 Days)', value: 0 }
      ]
    }
  },
  created () {
    this.fetchdata()
  },
  methods: {
    async fetchdata () {
      this.$http.secured.get('/analytics', {
        params: {}
      })
        .then(response => {
          this.stats[0].value = response.data.total_count
          this.stats[1].value = response.data.weekly_count
          this.stats[2].value = response.data.weekly_conv_count
        })
    }
  }
}
</script>

<style scoped>
.analytics-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100vw;
  height: 100vh;
  background-color: #f5f5f5;
  padding: 1rem;
  border-radius: 4px;
}

.stats-row {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  width: 100%;
  margin-top: 2rem;
}

.stat-container {
  width: calc(50% - 1rem);
  margin-bottom: 2rem;
}

.stat-item {
  width: 80%;
  padding: 1.7rem;
  padding-bottom: 1.3rem;
  background-color: lightskyblue;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  text-align: center;
  transition: transform 0.3s ease;
}

@media (min-width: 768px) {
  .stat-container {
    width: calc(50% - 1rem);
  }
}
@media (min-width: 992px) {
  .stat-container {
    width: calc(50% - 1rem);
  }
}

.stat-item h3 {
  margin-bottom: 0.5rem;
  font-size: 1.2rem;
  color: #333333;
}

.stat-item p {
  font-size: 1.5rem;
  font-weight: bold;
  color: black;
}

.stat-item:hover {
  transform: scale(1.05);
  background-color: #2C4E80;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animated-box {
  animation: fadeInUp 0.5s ease;
}
</style>
