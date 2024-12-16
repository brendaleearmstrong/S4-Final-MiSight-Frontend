<form onSubmit={handleSubmit} className="space-y-6">
  <div>
    <label
      htmlFor="username"
      className="block text-sm font-medium text-gray-200 mb-1"
    >
      Username
    </label>
    <input
      id="username"
      type="text"
      required
      value={formData.username}
      onChange={(e) =>
        setFormData({ ...formData, username: e.target.value })
      }
      className="w-full bg-gray-700 border border-gray-600 text-white rounded-md px-3 py-2 focus:outline-none focus:border-amber-500"
    />
  </div>

  <div>
    <label
      htmlFor="password"
      className="block text-sm font-medium text-gray-200 mb-1"
    >
      Password
    </label>
    <input
      id="password"
      type="password"
      required
      value={formData.password}
      onChange={(e) =>
        setFormData({ ...formData, password: e.target.value })
      }
      className="w-full bg-gray-700 border border-gray-600 text-white rounded-md px-3 py-2 focus:outline-none focus:border-amber-500"
    />
  </div>

  <div>
    <label
      htmlFor="confirm-password"
      className="block text-sm font-medium text-gray-200 mb-1"
    >
      Confirm Password
    </label>
    <input
      id="confirm-password"
      type="password"
      required
      value={formData.confirmPassword}
      onChange={(e) =>
        setFormData({ ...formData, confirmPassword: e.target.value })
      }
      className="w-full bg-gray-700 border border-gray-600 text-white rounded-md px-3 py-2 focus:outline-none focus:border-amber-500"
    />
  </div>

  <div>
    <label
      htmlFor="role"
      className="block text-sm font-medium text-gray-200 mb-1"
    >
      Role
    </label>
    <select
      id="role"
      required
      value={formData.role}
      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
      className="w-full bg-gray-700 border border-gray-600 text-white rounded-md px-3 py-2 focus:outline-none focus:border-amber-500"
    >
      <option value="">Select Role</option>
      <option value="ADMIN">Administrator</option>
      <option value="MINE_ADMIN">Mine Administrator</option>
      <option value="USER">Public Stakeholder</option>
    </select>
  </div>
</form>
