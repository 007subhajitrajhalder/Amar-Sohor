function UserManagementPage() {
  const users = [
    {
      id: 1,
      name: "Ananya Sen",
      email: "ananya@example.com"
    },
    {
      id: 2,
      name: "Rahul Das",
      email: "rahul@example.com"
    }
  ];

  return (
    <main className="min-h-screen bg-slate-100 p-6">
      <section className="mx-auto max-w-6xl">
        <h1 className="text-3xl font-bold">
          User Management
        </h1>

        <div className="mt-7 grid gap-4">
          {users.map((user) => (
            <article
              key={user.id}
              className="flex justify-between rounded-2xl bg-white p-6 shadow"
            >
              <div>
                <h2 className="text-xl font-bold">
                  {user.name}
                </h2>

                <p className="mt-1 text-slate-600">
                  {user.email}
                </p>
              </div>

              <button className="rounded-xl bg-red-600 px-5 py-2 font-bold text-white">
                Remove User
              </button>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

export default UserManagementPage;