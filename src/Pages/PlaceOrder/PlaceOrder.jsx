import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { FaXmark } from "react-icons/fa6";
import { FaRegTrashAlt } from "react-icons/fa";

// Mock authentication hook
const useAuth = () => ({
  user: { email: "sarfarazakram16@gmail.com", name: "Sarfaraz Akram" },
  userEmail: "sarfarazakram16@gmail.com"
});

// Mock localStorage functions
const getShopCart = (email) => {
  const cart = localStorage.getItem(`shopCart_${email}`);
  return cart ? JSON.parse(cart) : [];
};

const clearShopCart = (email) => {
  localStorage.removeItem(`shopCart_${email}`);
  localStorage.removeItem(`shopCartExpiry_${email}`);
};

const getShopCartRemainingTime = (email) => {
  const expiry = localStorage.getItem(`shopCartExpiry_${email}`);
  if (!expiry) return 0;
  return Math.max(0, parseInt(expiry) - Date.now());
};

const isShopCartValid = (email) => {
  return getShopCartRemainingTime(email) > 0;
};

// Initialize demo data
const initDemoData = (email) => {
  if (!localStorage.getItem(`shopCart_${email}`)) {
    const demoItems = [
      {
        id: 1,
        packageId: "pkg1",
        name: "Kitchen Faucet Anti-splash Aerator 360 Rotating Bubbler Bathroom Faucet Sprayer Saving Water Tap Sink Nozzle",
        brand: "No Brand",
        color: "Silver",
        price: 177,
        originalPrice: 250,
        discount: 29,
        quantity: 1,
        seller: "AK Mart",
        deliveryFee: 150,
        deliveryDate: "28 Oct-1 Nov",
        image: "faucet.jpg"
      },
      {
        id: 2,
        packageId: "pkg2",
        name: "Water Faucet Filter Household Kitchen Home Faucet Mini Tap Water Clean Purifier Filter Filtration Cartridge Carbon",
        brand: "No Brand",
        color: "Green",
        price: 195,
        originalPrice: 500,
        discount: 61,
        quantity: 1,
        seller: "Tanha shop 42",
        deliveryFee: 150,
        deliveryDate: "30 Oct-3 Nov",
        image: "filter.jpg"
      }
    ];
    localStorage.setItem(`shopCart_${email}`, JSON.stringify(demoItems));
    localStorage.setItem(`shopCartExpiry_${email}`, (Date.now() + 600000).toString()); // 10 minutes
  }
};

// Mock addresses
const mockAddresses = [
  {
    id: "addr1",
    name: "Sarfaraz Akram",
    phone: "01973254091",
    region: "Dhaka",
    city: "Gopalganj",
    area: "Koya Bansbari",
    address: "Koya Bansbari, Gopalganj Sadar Ulipur, Gopalganj, Dhaka",
    label: "HOME",
    isDefaultShipping: true,
    isDefaultBilling: true
  },
  {
    id: "addr2",
    name: "Sam",
    phone: "01973254091",
    region: "Chattogram",
    city: "Bandarban",
    area: "Koya Bansbari",
    address: "Koya Bansbari, Thanchi Lama, Bandarban, Chattogram",
    label: "OFFICE",
    isDefaultShipping: false,
    isDefaultBilling: false
  }
];

const PlaceOrder = () => {
  const navigate = useNavigate();
  const { user, userEmail } = useAuth();
  const [shopCartItems, setShopCartItems] = useState([]);
  const [remainingTime, setRemainingTime] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  
  // Address management
  const [addresses, setAddresses] = useState(mockAddresses);
  const [selectedShippingAddress, setSelectedShippingAddress] = useState(null);
  const [selectedBillingAddress, setSelectedBillingAddress] = useState(null);
  const [email, setEmail] = useState("");
  
  // Modal states
  const [showShippingModal, setShowShippingModal] = useState(false);
  const [showBillingModal, setShowBillingModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [showAddAddressModal, setShowAddAddressModal] = useState(false);
  const [addingForBilling, setAddingForBilling] = useState(false);
  
  // Form states
  const [newAddress, setNewAddress] = useState({
    name: "",
    phone: "",
    region: "",
    city: "",
    area: "",
    building: "",
    colony: "",
    address: "",
    label: "HOME"
  });

  useEffect(() => {
    if (!user) {
      alert("Please login first!");
      navigate("/login");
      return;
    }

    initDemoData(userEmail);
    const items = getShopCart(userEmail);

    if (!items || items.length === 0 || !isShopCartValid(userEmail)) {
      alert("No items found or session expired!");
      clearShopCart(userEmail);
      navigate(-1);
      return;
    }

    setShopCartItems(items);
    setRemainingTime(getShopCartRemainingTime(userEmail));
    setEmail(userEmail);
    
    // Set default addresses
    const defaultShipping = addresses.find(a => a.isDefaultShipping);
    const defaultBilling = addresses.find(a => a.isDefaultBilling);
    setSelectedShippingAddress(defaultShipping || addresses[0]);
    setSelectedBillingAddress(defaultBilling || addresses[0]);
    
    setIsLoading(false);

    const timer = setInterval(() => {
      const remaining = getShopCartRemainingTime(userEmail);

      if (remaining <= 0) {
        clearShopCart(userEmail);
        alert("Session expired! Please try again.");
        navigate(-1);
      } else {
        setRemainingTime(remaining);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate, user, userEmail, addresses]);

  const formatTime = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const calculateTotal = () => {
    const itemsTotal = shopCartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const deliveryTotal = shopCartItems.reduce((sum, item) => sum + item.deliveryFee, 0);
    return { itemsTotal, deliveryTotal, total: itemsTotal + deliveryTotal };
  };

  const handleAddAddress = () => {
    if (!newAddress.name || !newAddress.phone || !newAddress.region || !newAddress.city || !newAddress.area || !newAddress.address) {
      alert("Please fill all required fields");
      return;
    }

    const addressObj = {
      id: `addr${Date.now()}`,
      ...newAddress,
      isDefaultShipping: false,
      isDefaultBilling: false
    };

    setAddresses([...addresses, addressObj]);
    
    if (addingForBilling) {
      setSelectedBillingAddress(addressObj);
    }
    
    setShowAddAddressModal(false);
    setNewAddress({
      name: "",
      phone: "",
      region: "",
      city: "",
      area: "",
      building: "",
      colony: "",
      address: "",
      label: "HOME"
    });
  };

  const handleSelectShipping = (address) => {
    setSelectedShippingAddress(address);
    setShowShippingModal(false);
  };

  const handleSelectBilling = (address) => {
    setSelectedBillingAddress(address);
    setShowBillingModal(false);
    if (showInvoiceModal) {
      // Keep invoice modal open after selecting from billing
    }
  };

  const handleSaveInvoice = () => {
    setShowInvoiceModal(false);
  };

  const handleDeleteItem = (itemId) => {
    const updatedItems = shopCartItems.filter(item => item.id !== itemId);
    setShopCartItems(updatedItems);
    localStorage.setItem(`shopCart_${userEmail}`, JSON.stringify(updatedItems));
  };

  const handlePlaceOrder = () => {
    alert("Order placed successfully!");
    clearShopCart(userEmail);
    navigate("/");
  };

  const totals = calculateTotal();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1500px] mx-auto px-4 py-6">
        {/* Session Timer - Full Width at Top */}
        <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-3">
            <span className="text-2xl">⏱️</span>
            <div>
              <p className="text-yellow-800 font-semibold text-lg">
                Session expires in: {formatTime(remainingTime)}
              </p>
              <p className="text-yellow-700 text-sm">
                Complete your order within the time limit
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Section - Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Address */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Shipping & Billing</h2>
                <button
                  onClick={() => setShowShippingModal(true)}
                  className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                >
                  EDIT
                </button>
              </div>
              
              {selectedShippingAddress && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{selectedShippingAddress.name}</p>
                    <span className="text-sm">{selectedShippingAddress.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="bg-teal-500 text-white text-xs px-2 py-0.5 rounded">
                      {selectedShippingAddress.label}
                    </span>
                    <p className="text-sm text-gray-600">{selectedShippingAddress.address}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Package Items */}
            <div className="space-y-4">
              {shopCartItems.map((item, index) => (
                <div key={item.id} className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-sm text-gray-600">Package {index + 1} of {shopCartItems.length}</p>
                    </div>
                    <p className="text-sm text-gray-600">Shipped by {item.seller}</p>
                  </div>

                  <div className="border border-teal-500 rounded-lg p-4 mb-4">
                    <div className="flex items-start gap-2 mb-2">
                      <div className="w-5 h-5 bg-teal-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-white text-xs">✓</span>
                      </div>
                      <div>
                        <p className="font-medium">৳ {item.deliveryFee}</p>
                        <p className="text-sm text-gray-600">Standard Delivery</p>
                        <p className="text-sm text-gray-600">Guaranteed by {item.deliveryDate}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <img
                      src={`https://via.placeholder.com/80?text=${item.name.slice(0, 2)}`}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="text-sm font-medium mb-1">{item.name}</h3>
                      <p className="text-xs text-gray-500 mb-2">
                        {item.brand}, Color family:{item.color}
                      </p>
                      <div className="flex items-center gap-3">
                        <p className="text-orange-500 font-semibold">৳ {item.price}</p>
                        <p className="text-gray-400 line-through text-sm">৳ {item.originalPrice}</p>
                        <p className="text-sm text-gray-600">-{item.discount}%</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end justify-between">
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <FaRegTrashAlt size={18} />
                      </button>
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Section - Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6 space-y-6">
              {/* Promotion */}
              <div>
                <h3 className="font-semibold mb-3">Promotion</h3>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter Store/Daraz Code"
                    className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm"
                  />
                  <button className="bg-blue-500 text-white px-4 py-2 rounded text-sm hover:bg-blue-600">
                    APPLY
                  </button>
                </div>
              </div>

              {/* Invoice and Contact Info */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-semibold">Invoice and Contact Info</h3>
                  <button
                    onClick={() => setShowInvoiceModal(true)}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    Edit
                  </button>
                </div>
              </div>

              {/* Order Summary */}
              <div>
                <h3 className="font-semibold mb-4">Order Summary</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Items Total ({shopCartItems.length} Items)</span>
                    <span>৳ {totals.itemsTotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Delivery Fee</span>
                    <span>৳ {totals.deliveryTotal}</span>
                  </div>
                  <div className="border-t pt-3 flex justify-between items-center">
                    <span className="font-semibold">Total:</span>
                    <span className="text-orange-500 font-bold text-xl">৳ {totals.total}</span>
                  </div>
                  <p className="text-xs text-gray-500">VAT included, where applicable</p>
                </div>
              </div>

              <button
                onClick={handlePlaceOrder}
                className="w-full bg-orange-500 text-white py-3 rounded font-semibold hover:bg-orange-600 transition-colors"
              >
                Proceed to Pay
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Shipping Address Modal */}
      {showShippingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Shipping Address</h2>
                <button
                  onClick={() => {
                    setShowAddAddressModal(true);
                    setAddingForBilling(false);
                  }}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  Add new address
                </button>
              </div>

              <div className="space-y-4">
                {addresses.map((addr) => (
                  <div
                    key={addr.id}
                    className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                      selectedShippingAddress?.id === addr.id
                        ? "border-teal-500 bg-teal-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => handleSelectShipping(addr)}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        checked={selectedShippingAddress?.id === addr.id}
                        onChange={() => handleSelectShipping(addr)}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium">{addr.name}</p>
                          <span className="text-sm text-gray-600">{addr.phone}</span>
                        </div>
                        <span className="bg-orange-500 text-white text-xs px-2 py-0.5 rounded">
                          {addr.label}
                        </span>
                        <p className="text-sm text-gray-600 mt-1">{addr.address}</p>
                        {addr.isDefaultShipping && (
                          <span className="text-xs text-blue-600 mt-1 inline-block">
                            Default Shipping Address
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowShippingModal(false)}
                  className="flex-1 border border-gray-300 py-2 rounded hover:bg-gray-50"
                >
                  CANCEL
                </button>
                <button
                  onClick={() => setShowShippingModal(false)}
                  className="flex-1 bg-teal-500 text-white py-2 rounded hover:bg-teal-600"
                >
                  SAVE
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Invoice and Contact Info Modal */}
      {showInvoiceModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-6">Invoice and Contact Info</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    <span className="text-red-500">*</span> Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    disabled
                    className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-50 text-gray-600"
                  />
                  <p className="text-xs text-gray-500 mt-1">Enter your email to get delivery status updates</p>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium">
                      <span className="text-red-500">*</span> Billing Address
                    </label>
                    <button
                      onClick={() => {
                        setShowBillingModal(true);
                      }}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      EDIT
                    </button>
                  </div>
                  {selectedBillingAddress && (
                    <div className="border border-gray-300 rounded p-3 bg-gray-50">
                      <p className="font-medium">{selectedBillingAddress.name} {selectedBillingAddress.phone}</p>
                      <p className="text-sm text-gray-600">{selectedBillingAddress.address}</p>
                    </div>
                  )}
                  <p className="text-xs text-gray-500 mt-1">Please edit your billing address</p>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowInvoiceModal(false)}
                  className="flex-1 border border-gray-300 py-2 rounded hover:bg-gray-50"
                >
                  CANCEL
                </button>
                <button
                  onClick={handleSaveInvoice}
                  className="flex-1 bg-teal-500 text-white py-2 rounded hover:bg-teal-600"
                >
                  SAVE
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Billing Address Selection Modal */}
      {showBillingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Shipping Address</h2>
                <button
                  onClick={() => {
                    setShowAddAddressModal(true);
                    setAddingForBilling(true);
                  }}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  Add new address
                </button>
              </div>

              <div className="space-y-4">
                {addresses.map((addr) => (
                  <div
                    key={addr.id}
                    className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                      selectedBillingAddress?.id === addr.id
                        ? "border-teal-500 bg-teal-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => handleSelectBilling(addr)}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        checked={selectedBillingAddress?.id === addr.id}
                        onChange={() => handleSelectBilling(addr)}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium">{addr.name}</p>
                          <span className="text-sm text-gray-600">{addr.phone}</span>
                        </div>
                        <span className="bg-teal-500 text-white text-xs px-2 py-0.5 rounded">
                          {addr.label}
                        </span>
                        <p className="text-sm text-gray-600 mt-1">
                          Region: {addr.region} - {addr.city} - {addr.area}
                        </p>
                        {addr.isDefaultBilling && (
                          <span className="text-xs text-blue-600 mt-1 inline-block">
                            Default Billing Address
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowBillingModal(false)}
                  className="flex-1 border border-gray-300 py-2 rounded hover:bg-gray-50"
                >
                  CANCEL
                </button>
                <button
                  onClick={() => setShowBillingModal(false)}
                  className="flex-1 bg-teal-500 text-white py-2 rounded hover:bg-teal-600"
                >
                  SAVE
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Address Modal */}
      {showAddAddressModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[70] p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Add new shipping Address</h2>
                <button
                  onClick={() => setShowAddAddressModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FaXmark size={24} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Full name</label>
                  <input
                    type="text"
                    placeholder="Enter your first and last name"
                    value={newAddress.name}
                    onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Region</label>
                  <select
                    value={newAddress.region}
                    onChange={(e) => setNewAddress({ ...newAddress, region: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  >
                    <option value="">Please choose your region</option>
                    <option value="Dhaka">Dhaka</option>
                    <option value="Chattogram">Chattogram</option>
                    <option value="Rajshahi">Rajshahi</option>
                    <option value="Khulna">Khulna</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Phone Number</label>
                  <input
                    type="tel"
                    placeholder="Please enter your phone number"
                    value={newAddress.phone}
                    onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">City</label>
                  <select
                    value={newAddress.city}
                    onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  >
                    <option value="">Please choose your city</option>
                    <option value="Gopalganj">Gopalganj</option>
                    <option value="Bandarban">Bandarban</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Building / House No / Floor / Street</label>
                  <input
                    type="text"
                    placeholder="Please enter"
                    value={newAddress.building}
                    onChange={(e) => setNewAddress({ ...newAddress, building: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Area</label>
                  <select
                    value={newAddress.area}
                    onChange={(e) => setNewAddress({ ...newAddress, area: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  >
                    <option value="">Please choose your area</option>
                    <option value="Koya Bansbari">Koya Bansbari</option>
                    <option value="Thanchi Lama">Thanchi Lama</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Colony / Suburb / Locality / Landmark</label>
                  <input
                    type="text"
                    placeholder="Please enter"
                    value={newAddress.colony}
                    onChange={(e) => setNewAddress({ ...newAddress, colony: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-2">Address</label>
                  <input
                    type="text"
                    placeholder="For Example: House# 123, Street# 123, ABC Road"
                    value={newAddress.address}
                    onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium mb-3">Select a label for effective delivery:</label>
                <div className="flex gap-3">
                  <button
                    onClick={() => setNewAddress({ ...newAddress, label: "OFFICE" })}
                    className={`flex items-center gap-2 px-6 py-3 rounded border-2 transition-colors ${
                      newAddress.label === "OFFICE"
                        ? "border-teal-500 bg-teal-50 text-teal-700"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    <span>🏢</span>
                    <span>OFFICE</span>
                  </button>
                  <button
                    onClick={() => setNewAddress({ ...newAddress, label: "HOME" })}
                    className={`flex items-center gap-2 px-6 py-3 rounded border-2 transition-colors ${
                      newAddress.label === "HOME"
                        ? "border-orange-500 bg-orange-50 text-orange-700"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    <span>🏠</span>
                    <span>HOME</span>
                  </button>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowAddAddressModal(false)}
                  className="flex-1 border border-gray-300 py-3 rounded hover:bg-gray-50 font-medium"
                >
                  CANCEL
                </button>
                <button
                  onClick={handleAddAddress}
                  className="flex-1 bg-teal-500 text-white py-3 rounded hover:bg-teal-600 font-medium"
                >
                  SAVE
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlaceOrder;