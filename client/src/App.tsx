import { useState, useEffect } from "react";
import axios from "axios";

export default function App() {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    subdomain: "",
    file: null,
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  function fetchUsers() {
    axios
      .get("http://localhost:8080/users")
      .then(response => {
        setUsers(response.data);
        console.log(response.data);
      })
      .catch(error => {
        console.error("Error fetching users:", error);
      });
  }

  async function handleFormSubmit(event) {
    event.preventDefault();

    const form = new FormData();
    form.append("username", formData.username);
    form.append("email", formData.email);
    form.append("subdomain", formData.subdomain);
    form.append("file", formData.file!);

    try {
      const response = await axios.post("http://localhost:8080/upload", form);
      console.log("Upload Success:", response.data);
       fetchUsers();
    } catch (error) {
 
      window.alert(error.response.data.message);
    }
  }

  function handleInputChange(event) {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  }

  function handleFileChange(event) {
    setFormData({ ...formData, file: event.target.files[0] });
  }

  async function deleteUser(userId: any) {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axios.delete(`http://localhost:8080/users/${userId}`);
        fetchUsers(); // Refresh users after delete
      } catch (error) {
        console.error("Delete Error:", error);
      }
    }
  }

  async function deleteAllUsers() {
    if (window.confirm("Are you sure you want to delete all users?")) {
      try {
        await axios.delete("http://localhost:8080/users");
        fetchUsers(); // Refresh users after delete all
      } catch (error) {
        console.error("Delete All Error:", error);
      }
    }
  }

  // return(<>hello</>)

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <div className="max-w-3xl mx-auto bg-white p-8 shadow-lg rounded-lg">
        <h1 className="text-2xl font-bold mb-4">Upload HTML File</h1>
        <form
          onSubmit={handleFormSubmit}
          encType="multipart/form-data"
          className="space-y-4"
        >
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              required
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="subdomain"
              className="block text-sm font-medium text-gray-700"
            >
              Subdomain
            </label>
            <input
              type="text"
              id="subdomain"
              name="subdomain"
              value={formData.subdomain}
              onChange={handleInputChange}
              required
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="file"
              className="block text-sm font-medium text-gray-700"
            >
              HTML File
            </label>
            <input
              type="file"
              id="file"
              name="file"
              onChange={handleFileChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-500 text-white py-2 px-4 rounded-md shadow-md hover:bg-indigo-600 focus:outline-none"
          >
            Upload
          </button>
        </form>

        <h2 className="text-xl font-bold mt-8">Subdomains</h2>
        <button
          onClick={deleteAllUsers}
          className="w-full bg-red-500 text-white py-2 px-4 rounded-md shadow-md hover:bg-red-600 focus:outline-none mt-4"
        >
          Delete All Users
        </button>

        <table className="min-w-full mt-4 bg-white border border-gray-300 rounded-lg">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-3 border-b border-gray-300 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Username
              </th>
              <th className="px-6 py-3 border-b border-gray-300 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 border-b border-gray-300 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Subdomain
              </th>
              <th className="px-6 py-3 border-b border-gray-300 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap border-b border-gray-300">
                  {user.username}
                </td>
                <td className="px-6 py-4 whitespace-nowrap border-b border-gray-300">
                  {user.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap border-b border-gray-300">
                  <a
                    href={`http://${user.subdomain}.localhost`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {user.subdomain}.localhost
                  </a>
                </td>
                <td className="px-6 py-4 whitespace-nowrap border-b border-gray-300">
                  <button
                    onClick={() => deleteUser(user.id)}
                    className="bg-red-500 text-white py-1 px-3 rounded-md shadow-md hover:bg-red-600 focus:outline-none"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
