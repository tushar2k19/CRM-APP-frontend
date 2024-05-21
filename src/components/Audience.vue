<template>
  <div class="audience-container">
    <div class="container1">
      <div class="search-and-filter" style="margin-top: -10px">
        <div class="search-bar">
          <input type="text" v-model="searchText" placeholder="Search Contacts..." @keyup.enter="onSearch">
          <div v-if="!resetbutton">
            <button @click="onSearch">Search</button>
          </div>
          <div v-else>
            <button @click="onReset" style="background-color: #41095a">Reset</button>
          </div>
        </div>

        <div class="filter-button" style="margin-left: 10px">
          <button class="add-button" style="margin-top: 30px; padding: 5px 8px;font-size: 14px; font-weight: 500" @click="showDateFilterModalfn">Filter by Date</button>
          <div v-if="dateFilterModal" class="modal-content">
            <transition name="fade" appear>
              <div class="modal-overlay" v-if="dateFilterModal" @click="dateFilterModal = false"></div>
            </transition>
            <transition name="slide" appear>
              <div class="modal" v-if="dateFilterModal">
                <div class="date-picker">
                  <label for="startDate">Start Date:</label>
                  <input type="date" id="startDate" v-model="startDate" required>
                  <br><br>
                  <label for="endDate">End Date:   </label>
                  <input type="date" id="endDate" v-model="endDate" required>
                  <br>
                </div>

                <br><br>
                <button class="button" @click="closeButton">
                  Close
                </button>
                <button class="button" @click="onFilterByDate()">
                  Filter
                </button>
              </div>
            </transition>
          </div>
        </div>
      </div>

      <button class="add-button" @click="showAddContactModalfn">Add Contact</button>
      <div class="add-contact" style="margin-top: -40px">
        <div v-if="showAddContactModal" class="modal-content">
          <transition name="fade" appear>
            <div class="modal-overlay" v-if="showAddContactModal" @click="showAddContactModal = false"></div>
          </transition>
          <transition name="slide" appear>
            <div class="modal" v-if="showAddContactModal">
              <form @submit.prevent="saveContact">
                <div v-if="incomplete_details" style="margin-bottom: 10px;">
                  <p class="error-message" style="color: red;">Please fill all mandatory fields</p>
                </div>
                <label for="name" style="display: block; margin-bottom: 5px;">Name:</label>
                <input type="text" id="name" v-model="newContact.name" style="width: 100%; padding: 5px; margin-bottom: 10px; border: 1px solid #ccc; border-radius: 4px; box-shadow: 0 0 0px 1px #ddd, 0 1px 5px rgba(0, 0, 0, 0.08); transition: box-shadow 0.3s ease-in-out;" required placeholder="Vikas"><br>

                <label for="phone" style="display: block; margin-bottom: 5px;">Phone:</label>
                <input type="tel" id="phone" v-model="newContact.phone" style="width: 100%; padding: 5px; margin-bottom: 10px; border: 1px solid #ccc; border-radius: 4px; box-shadow: 0 0 0px 1px #ddd, 0 1px 5px rgba(0, 0, 0, 0.08); transition: box-shadow 0.3s ease-in-out;" pattern="(\+)?[0-9]{9,13}"
                       required placeholder="+919727481924"><br>

                <label for="email" style="display: block; margin-bottom: 5px;">Email:</label>
                <input type="email" id="email" v-model="newContact.email" style="width: 100%; padding: 5px; margin-bottom: 10px; border: 1px solid #ccc; border-radius: 4px; box-shadow: 0 0 0px 1px #ddd, 0 1px 5px rgba(0, 0, 0, 0.08); transition: box-shadow 0.3s ease-in-out;" required placeholder="drishti@gmail.com"><br>

                <label for="url" style="display: block; margin-bottom: 5px;">Website (optional):</label>
                <input type="url" id="url" v-model="newContact.url" style="width: 100%; padding: 5px; margin-bottom: 10px; border: 1px solid #ccc; border-radius: 4px; box-shadow: 0 0 0px 1px #ddd, 0 1px 5px rgba(0, 0, 0, 0.08); transition: box-shadow 0.3s ease-in-out;"><br>
              <br><br>

                <button class="button" @click="closeButton" style="margin-right: 10px;">
                  Close
                </button>
                <button type="submit" class="button">
                  Add
                </button>
              </form>
            </div>
          </transition>
        </div>
      </div>
    </div>

    <box class="table-card" style="padding-bottom: 15px">
      <div class="tables mt_30" v-if="contacts.length > 0">
        <table class="table_container" ref="campaignTable">
          <thead>
          <tr class="table_row" style="border: none">
            <th class="table_head" v-for="item in headers" :key="item">{{ item }}</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(item, index) in contacts" :key="index" class="table_row">
            <td class="table_data"
                style="width: 30%; cursor: pointer; text-overflow: ellipsis; overflow: hidden; height: 10px;"
                v-on:click="onEditClick(item)">{{ item.name }}
            </td>
            <td class="table_data" style="width: 30%; ">{{
                item.email
              }}
            </td>
            <td class="table_data" style="width: 40%; ">{{
                item.phone
              }}
            </td>
            <td class="table_data" style="width: 16%;" @mouseleave="isDropdown = false">
              <div class="actions_container">
                <button class="edit_button" variant="outline-secondary" v-on:click="onEditClick(item)">Edit</button>
                <button class="edit_button" v-on:click="onConfirmDelete(item)">Delete</button>
              </div>
            </td>
          </tr>
          </tbody>
        </table>
        <transition name="fade" appear>
          <div class="modal-overlay" v-if="editConfirmation" @click="editConfirmation = false"></div>
        </transition>
        <transition name="slide" appear>
          <div class="modal" v-if="editConfirmation">
            <form @submit.prevent="onEdit">
              <label for="name">Name:</label><br>
              <input type="text" id="name" v-model="editname" style="width: 100%; padding: 5px; margin-bottom: 10px; border: 1px solid #ccc; border-radius: 4px; box-shadow: 0 0 0px 1px #ddd, 0 1px 5px rgba(0, 0, 0, 0.08); transition: box-shadow 0.3s ease-in-out;" required><br>
              <label for="phone">Phone:</label><br>
              <input type="tel" id="phone" v-model="editphone" style="width: 100%; padding: 5px; margin-bottom: 10px; border: 1px solid #ccc; border-radius: 4px; box-shadow: 0 0 0px 1px #ddd, 0 1px 5px rgba(0, 0, 0, 0.08); transition: box-shadow 0.3s ease-in-out;" pattern="[+]?[0-9]+[0-9]{10,12}" required><br>

              <label for="email">Email:</label><br>
              <input type="email" id="email" v-model="editemail" style="width: 100%; padding: 5px; margin-bottom: 10px; border: 1px solid #ccc; border-radius: 4px; box-shadow: 0 0 0px 1px #ddd, 0 1px 5px rgba(0, 0, 0, 0.08); transition: box-shadow 0.3s ease-in-out;" required><br>
              <label for="url">Website (optional):</label><br>
              <input type="url" id="url" v-model="editurl" style="width: 100%; padding: 5px; margin-bottom: 10px; border: 1px solid #ccc; border-radius: 4px; box-shadow: 0 0 0px 1px #ddd, 0 1px 5px rgba(0, 0, 0, 0.08); transition: box-shadow 0.3s ease-in-out;"><br>
              <br><br>
              <button class="button" @click="closeButton">
                Close
              </button>
              <button type="submit" class="button">
                Update
              </button>
            </form>
          </div>

        </transition>

        <transition name="fade" appear>
          <div class="modal-overlay" v-if="deleteConfirmation" @click="deleteConfirmation = false"></div>
        </transition>
        <transition name="slide" appear>
          <div class="modal" v-if="deleteConfirmation">
            <div class="top_bar" style="align-items: baseline">
              <h3 class="page_title_common">Delete Contact</h3>
            </div>
            <br><br>
            <hr class="seperator" />
            <h6 class="my-1" style="font-size: 14px;">Are you sure you want to delete this contact</h6>
            <hr class="seperator" />

            <br><br>

            <button class="button" @click="closeButton">
              Close
            </button>
            <button class="button" @click="onDelete()">
              Delete
            </button>
          </div>
        </transition>
      </div>
      <div class = "pagination-container">
        <div class="pagination1" v-if="pagesToDisplay.length >= 1">
          <div class="pagination-controls1">
            <button v-on:click="fastPrevPage" class="fast-prev-page1" v-if="(this.total_count/this.perPage)>20 && (currentPage1-pagesToDisplay[0])>=4"><img :src="DoubleLeft_ic" /></button>
            <button v-on:click="prevPage" class="prev-page1" v-if="currentPage1!==1"><img :src="left_ic" /></button>
            <template v-for="page in pagesToDisplay">
              <template v-if="page === 'ellipsis'">
                <span class="ellipsis"><img :src="pagination_ic" /></span>
              </template>
              <template v-else>
                <button v-on:click="changePage(page)" :class="{ active: currentPage1 === page }" class="page-number1">
                  {{ page }}
                </button>
              </template>
            </template>
            <button v-on:click="nextPage" class="next-page1" v-if="currentPage1!=pagesToDisplay[pagesToDisplay.length-1]"><img :src="right_ic" /></button>
            <button v-on:click="fastNextPage" class="fast-next-page1" v-if="(this.total_count/this.perPage)>20 && (pagesToDisplay[pagesToDisplay.length-1]-currentPage1)>=4"><img :src="DoubleRight_ic" /></button>
          </div>
        </div>
      </div>
    </box>
  </div>
</template>

<script>
import pagination_ic from '../assets/images/pagination_dots.svg'
import left_ic from '../assets/images/left.svg'
import right_ic from '../assets/images/right.svg'
import DoubleLeft_ic from '../assets/images/DoubleLeft.svg'
import DoubleRight_ic from '../assets/images/DoubleRight.svg'
export default {
  name: 'Audience',
  data() {
    return {
      left_ic,
      right_ic,
      pagination_ic,
      DoubleLeft_ic,
      DoubleRight_ic,
      showAddContactModal: false,
      newContact: {
        name: '',
        phone: '',
        email: '',
      },
      editname: '',
      editphone: '',
      editemail: '',
      editurl: '',
      editid: -1,
      contacts: [],
      currentPage1: 1,
      currentPage: 1,
      perPage: 5,
      pagesToShow: 2,
      fastJump: 4,
      headers: ["Name", "Email", "Phone", "Actions"],
      isDropdown: false,
      editConfirmation: false,
      deleteConfirmation: false,
      incomplete_details: false,
      resetbutton: false,
      searchText: '',
      startDate: '',
      endDate: '',
      dateFilterModal: false,
      total_count: -1,

    };
  },
  computed: {
    pages() { //req
      return Array.from({length: Math.ceil(this.total_count / this.perPage)}, (_, i) => i + 1)
    },
    pagesToDisplay() { //req
      const pages = []
      const totalPages = this.pages.length
      const start = Math.max(this.currentPage1 - this.pagesToShow, 1)
      const end = Math.min(this.currentPage1 + this.pagesToShow, totalPages)
      for (let i = start; i <= end; i++) {
        pages.push(i)
      }
      if (this.currentPage1 > this.pagesToShow + 1) pages.unshift(this.currentPage1 - (this.currentPage1 - 1), 'ellipsis')
      if (this.currentPage1 < totalPages - this.pagesToShow) pages.push('ellipsis', totalPages)
      console.log(pages)
      return pages
    }
  },
  mounted() {
    this.fetchContacts(1);
  },
  methods: {
    onFilterByDate() {
      this.$http.secured.get('/profile/filter',
        {
          params: {
            start: this.startDate,
            end: this.endDate,
            page: this.currentPage1
          }
        })
        .then(response => {
          this.resetbutton = true;
          this.startDate = ''
            this.endDate = ''
          this.dateFilterModal = false
          console.log("onsearch",response.data.data);
           this.contacts = response.data.data;
           this.total_count = response.data.count;
        });
    },
    onSearch() {
      if(this.searchText.trim()===''){
        alert("Search can't be left empty");
        return
      }
      this.$http.secured.get('/profile/search',
        {
          params: {
            page: this.currentPage1,
            searchText: this.searchText
          }
        })
        .then(response => {
          this.resetbutton = true;
          console.log("onsearch",response.data.data);
          this.contacts = response.data.data;
          this.total_count = response.data.count;
        });
    },
    onReset(){
      this.searchText = '';
      this.startDate = ''
      this.endDate = ''
      this.resetbutton = false;
      this.fetchContacts(this.currentPage1);
    },
    showAddContactModalfn() {
      this.showAddContactModal = true;
      this.newContact = { name: '', phone: '', email: '', url: '' };
    },
    showDateFilterModalfn() {
      this.dateFilterModal =  true;
      this.startDate = '';
      this.endDate = '';
    },
    saveContact() {
      if (this.areDetailsComplete()) {
        this.$http.secured.post('/profile/new',
          {
            name: this.newContact.name,
            email: this.newContact.email,
            phone: this.newContact.phone,
          })
          .then( response => {
            this.showAddContactModal = false;
            this.newContact = { name: '', email: '', phone: '' };
            this.incomplete_details = false;
            this.fetchContacts(this.currentPage);
          });
      }
    },
    areDetailsComplete() {
      if (this.newContact.email === '' || this.newContact.phone === '' || this.newContact.name === '') {
        this.incomplete_details = true;
        return false;
      }
      return true;
    },
    fetchContacts(page){
      this.$http.secured.get('/profile',
        {
          params: {
            page: page
          }
        })
        .then(response => {
          this.contacts = response.data.data;
          this.total_count = response.data.count;
          console.log("fetch contacts", response)
        });
      this.resetbutton = false;
    },
    closeButton() {
      this.editphone = '';
      this.editname=''
      this.editemail = ''
      this.editurl = ''
      this.editid = -1
      this.dateFilterModal = false
      this.showAddContactModal = false;
        this.incomplete_details = false;
      this.editConfirmation = false;
        this.deleteConfirmation = false;
        this.startDate = ''
      this.endDate = ''
    },
    changePage(page) {
      if (page === 'ellipsis') return
      this.currentPage1 = page
      this.pageChanged(this.currentPage1)
    },
    prevPage() {
      if (this.currentPage1 > 1) {
        this.currentPage1--
        this.pageChanged(this.currentPage1)
      }
    },
    nextPage() {
      if (this.currentPage1 < this.pages.length) {
        this.currentPage1++
        this.pageChanged(this.currentPage1)
      }
    },
    fastPrevPage() {
      if (this.currentPage1 > 1) {
        this.currentPage1 -= this.fastJump
        this.pageChanged(this.currentPage1)
      }
    },
    fastNextPage() {
      if (this.currentPage1 < this.pages.length) {
        this.currentPage1 += this.fastJump
        this.pageChanged(this.currentPage1)
      }
    },
    pageChanged(val) {
      this.fetchContacts(val)
    },
    onEditClick(item) {
      this.editname = item.name
      this.editphone = item.phone
      this.editemail = item.email
      this.editurl = item.url
      this.editid = item.id

      this.editConfirmation = true
    },
    onEdit() {
      this.editConfirmation = false;
      this.$http.secured.put('/profile/update',
        {
          id: this.editid,
          name: this.editname,
          email: this.editemail,
          phone: this.editphone,
        })
        .then( response => {
          this.editphone = '';
          this.editname=''
          this.editemail = ''
          this.editurl = ''
          this.editid = -1
          this.searchText = ''
          this.startDate = ''
          this.endDate = ''
          this.resetbutton = false
          this.fetchContacts(this.currentPage1)
          alert("Edited Successfully!!");
        });
    },
    onDelete() {
      this.deleteConfirmation = false;
      this.$http.secured.delete('/profile/delete', {
            data: {
              id: this.newContact.id
            }})
        .then(response => {
          this.newContact = { name: '', email: '', phone: '' }
          this.fetchContacts(this.currentPage1)
          alert('Deleted Successfully!!')
        })
    },
    onConfirmDelete (item) {
      this.newContact = item
      this.deleteConfirmation = true
    }
  }
}

</script>
<style scoped>
.audience-container {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.add-contact {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}
.add-contact-form label {
  font-weight: bold;
}
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'montserrat', sans-serif;
}

.button {
  appearance: none;
  outline: none;
  border: none;
  background: none;
  cursor: pointer;

  display: inline-block;
  padding: 15px 25px;
  background-image: linear-gradient(to right, #2c6df8, #51a0fa);
  border-radius: 8px;

  color: #FFF;
  font-size: 18px;
  font-weight: 700;

  box-shadow: 3px 3px rgba(0, 0, 0, 0.4);
  transition: 0.4s ease-out;

  &:hover {
    box-shadow: 6px 6px rgba(0, 0, 0, 0.6);
  }
}
.add-button {
  margin-bottom: 30px;
  appearance: none;
  outline: none;
  border: none;
  background: none;
  cursor: pointer;
margin-top: -30px;
  display: inline-block;
  padding: 11px 20px;
  background-image: linear-gradient(to right, #2c6df8, #51a0fa);
  border-radius: 8px;

  color: #FFF;
  font-size: 18px;
  font-weight: 700;

  box-shadow: 3px 3px rgba(0, 0, 0, 0.4);
  transition: 0.4s ease-out;

  &:hover {
    box-shadow: 6px 6px rgba(0, 0, 0, 0.6);
  }
}

.modal-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 98;
  background-color: rgba(0, 0, 0, 0.3);
}

.modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 99;

  width: 100%;
  max-width: 400px;
  background-color: #FFF;
  border-radius: 16px;

  padding: 25px;

  h1 {
    color: #222;
    font-size: 32px;
    font-weight: 900;
    margin-bottom: 15px;
  }

  p {
    color: #666;
    font-size: 18px;
    font-weight: 400;
    margin-bottom: 15px;
  }
}
.container1 {
  border-radius: 10px;
  background-color: #f0f0f0;
  padding: 20px;
  margin-bottom: -20px;
}

.search-and-filter {
  padding: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 30px;
  margin-bottom: -15px;
}

.search-bar {
  width: 100%;
  display: flex;
  align-items: center;
  border-radius: 5px;
  overflow: hidden;
  background-color: #fff;
}

.search-bar input[type="text"] {
  flex: 1;
  padding: 10px;
  border: none;
  outline: none;
}

.search-bar button {
  padding: 10px 20px;
  background-color: #007bff;
  color: #fff;
  border: none;
  cursor: pointer;
  outline: none;
}

.search-bar button:hover {
  background-color: #0056b3;
}

.date-picker label {
  margin-right: 10px;
}

.date-picker input[type="date"] {
  padding: 8px;
  border-radius: 5px;
  border: 1px solid #ccc;
  outline: none;
}

.date-picker button {
  padding: 8px 20px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  outline: none;
}

.date-picker button:hover {
  background-color: #0056b3;
}

.add-contact button {
  padding: 10px 20px;
  background-color: #28a745;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  outline: none;
}

.add-contact button:hover {
  background-color: #218838;
}
.table_container {
  width: 100%;
  border-collapse: collapse;
}

.table_row:nth-child(even) {
  background-color: #f2f2f2;
}

.table_head,
.table_data {
  text-align: center;
  padding: 10px;
  border: 1px solid #ddd;
}

.table_head {
  background-color: #f0f0f0;
}

.actions_container {
  display: flex;
  justify-content: center;
}

.edit_button {
  padding: 8px 16px;
  margin: 0 4px;
  border: 1px solid #ddd;
  background-image: linear-gradient(to right, #2c6df8, #51a0fa);
  color: #FFFF;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}
.edit_button button:hover {
  background-color: #0056b3;
}

.edit_button:hover {
  background-color: #ddd;
}
.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
  align-items: center;
}

.pagination-controls1 {
  display: flex;
  align-items: center;
}

.page-number1 {
  padding: 5px 8px;
  margin: 0 5px;
  border: none;
  background-color: transparent;
  cursor: pointer;
}

.page-number1.active {
  background-color: #007bff;
  color: #fff;
  border-radius: 5px;
}

.ellipsis img {
  width: 15px;
}
.table-card {
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  padding: 70px;
  padding-top: 40px;

  margin-bottom: 20px;
}
</style>
