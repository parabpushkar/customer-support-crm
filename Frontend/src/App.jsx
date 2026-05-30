import { useEffect, useState } from "react";

function App() {
const [search, setSearch] = useState("");
const [statusFilter, setStatusFilter] = useState("");

const [tickets, setTickets] = useState([]);

const [formData, setFormData] = useState({
customer_name: "",
customer_email: "",
subject: "",
description: "",
});

const fetchTickets = async () => {
const url = `http://127.0.0.1:8000/api/tickets?search=${search}&status=${statusFilter}`;


const response = await fetch(url);
const data = await response.json();

setTickets(data);


};

useEffect(() => {
fetchTickets();
}, [search, statusFilter]);

const handleSubmit = async (e) => {
e.preventDefault();


const response = await fetch(
  "http://127.0.0.1:8000/api/tickets",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  }
);

if (response.ok) {
  setFormData({
    customer_name: "",
    customer_email: "",
    subject: "",
    description: "",
  });

  fetchTickets();
}


};

return ( <div className="min-h-screen bg-slate-100 py-8"> <div className="max-w-6xl mx-auto px-4">


    <div className="mb-8">
      <h1 className="text-4xl font-bold text-slate-800">
        Customer Support CRM
      </h1>

      <p className="text-slate-500 mt-2">
        Manage customer tickets, track progress and resolve issues efficiently.
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">

      <div className="bg-white rounded-xl shadow p-5">
        <h3 className="text-gray-500 text-sm">Total Tickets</h3>
        <p className="text-3xl font-bold mt-2">
          {tickets.length}
        </p>
      </div>

      <div className="bg-white rounded-xl shadow p-5">
        <h3 className="text-gray-500 text-sm">Open Tickets</h3>
        <p className="text-3xl font-bold text-yellow-600 mt-2">
          {tickets.filter(t => t.status === "Open").length}
        </p>
      </div>

      <div className="bg-white rounded-xl shadow p-5">
        <h3 className="text-gray-500 text-sm">Closed Tickets</h3>
        <p className="text-3xl font-bold text-green-600 mt-2">
          {tickets.filter(t => t.status === "Closed").length}
        </p>
      </div>

    </div>

    <div className="bg-white p-4 rounded-xl shadow mb-6 flex gap-4">
      <input
        type="text"
        placeholder="Search tickets..."
        className="border p-3 rounded-lg w-full"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <select
        className="border p-3 rounded-lg"
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
      >
        <option value="">All Status</option>
        <option value="Open">Open</option>
        <option value="In Progress">In Progress</option>
        <option value="Closed">Closed</option>
      </select>
    </div>

    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-xl shadow mb-8"
    >
      <h2 className="text-xl font-semibold mb-4">
        Create New Ticket
      </h2>

      <div className="grid gap-4">

        <input
          type="text"
          placeholder="Customer Name"
          className="border p-3 rounded-lg"
          value={formData.customer_name}
          onChange={(e) =>
            setFormData({
              ...formData,
              customer_name: e.target.value,
            })
          }
        />

        <input
          type="email"
          placeholder="Customer Email"
          className="border p-3 rounded-lg"
          value={formData.customer_email}
          onChange={(e) =>
            setFormData({
              ...formData,
              customer_email: e.target.value,
            })
          }
        />

        <input
          type="text"
          placeholder="Subject"
          className="border p-3 rounded-lg"
          value={formData.subject}
          onChange={(e) =>
            setFormData({
              ...formData,
              subject: e.target.value,
            })
          }
        />

        <textarea
          placeholder="Description"
          className="border p-3 rounded-lg"
          rows="4"
          value={formData.description}
          onChange={(e) =>
            setFormData({
              ...formData,
              description: e.target.value,
            })
          }
        />

        <button
          type="submit"
          className="bg-black text-white p-3 rounded-lg hover:bg-gray-800 transition"
        >
          Create Ticket
        </button>

      </div>
    </form>

    <div className="grid gap-4">

      {tickets.length === 0 ? (
        <div className="bg-white p-6 rounded-xl shadow text-center">
          No tickets found
        </div>
      ) : (
        tickets.map((ticket) => (
          <div
            key={ticket.id}
            className="bg-white p-6 rounded-xl shadow hover:shadow-xl transition border border-gray-100"
          >
            <h2 className="font-bold text-xl">
              {ticket.subject}
            </h2>

            <p className="text-gray-500 text-sm mt-1">
              Ticket ID: {ticket.ticket_id}
            </p>

            <p className="mt-3 font-medium">
              {ticket.customer_name}
            </p>

            <p className="text-sm text-gray-500">
              {ticket.customer_email}
            </p>

            <p className="mt-3 text-gray-700">
              {ticket.description}
            </p>

            <p
              className={`mt-4 font-semibold ${
                ticket.status === "Open"
                  ? "text-yellow-600"
                  : ticket.status === "Closed"
                  ? "text-green-600"
                  : "text-blue-600"
              }`}
            >
              Status: {ticket.status}
            </p>

            <div className="mt-3">
              <select
                value={ticket.status}
                onChange={async (e) => {
                  await fetch(
                    `http://127.0.0.1:8000/api/tickets/${ticket.ticket_id}?status=${e.target.value}`,
                    {
                      method: "PUT",
                    }
                  );

                  fetchTickets();
                }}
                className="border p-2 rounded-lg"
              >
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
          </div>
        ))
      )}

    </div>

  </div>
</div>

);
}

export default App;
