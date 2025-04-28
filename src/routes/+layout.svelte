<script>
  import { base } from '$app/paths';
</script>

<nav>
  <a href="{base}/" class="logo">ComicsMentor</a>
  <div class="nav-links">
    <a href="{base}/">Home</a>
    <a href="{base}/comics">Comics</a>
    <a href="{base}/contact">Contact</a>
    <a href="{base}/about">About</a>
  </div>
</nav>

<slot />

<style>
  nav {
    display: flex;
    justify-content: space-between;
    padding: 1.5rem;
    background: #1a1a1a;
    color: white;
  }

  .nav-links {
    display: flex;
    gap: 2rem;
  }

  a {
    color: white;
    text-decoration: none;
    font-weight: 500;
  }
</style>
