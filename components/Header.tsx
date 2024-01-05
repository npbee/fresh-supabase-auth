export function Header() {
  return (
    <header class="bg-gray-50 border-b border-gray-200 text-sm">
      <div class="container mx-auto flex justify-between p-4">
        <h1>
          <a href="/">My App</a>
        </h1>
        <nav>
          <ul class="flex gap-4">
            <li>
              <a href="/dashboard">Dashboard</a>
            </li>
            <li>
              <a href="/auth/signin">Sign in</a>
            </li>
            <li>
              <a href="/auth/signup">Sign up</a>
            </li>
            <li>
              <a href="/auth/signout">Sign out</a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
