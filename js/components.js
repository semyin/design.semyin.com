const Header = `
  <ul>
      <li><a href="">Profile</a></li>
      <li><a href="">Journal</a></li>
      <li><a href="">Collections</a></li>
      <li><a href="">Bookmarks</a></li>
      <li><a href="">Discovery</a></li>
    </ul>
    <div class="tool-box">
      <!-- <button><img src="./assets/svg/search.svg" alt=""></button> -->
      <button><img src="./assets/svg/日间模式.svg" alt=""></button>
    </div>
`

const Footer = `
  <div>
      <p>© 2025 All rights reserved.</p>
    <p>Site has been running for 3 days.</p>
    <p>Theme sonic Powered by Supabase and cloudflare</p>
    </div>
    <div>
      <button>🚀 Go Top</button>
    </div>
`

function renderFooter() {
  document.querySelector('footer').innerHTML = Footer
}

function renderHeader() {
  document.querySelector('header').innerHTML = Header
}

renderFooter()
renderHeader()