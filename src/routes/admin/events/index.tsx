import { createFileRoute, Link } from "@tanstack/react-router";
import { AdminDashboardLayout } from "@/components/AdminDashboardLayout";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/Pagination";
import { Search, Eye, CheckCircle, XCircle, Clock, Calendar, Filter, X, Edit, Save, Plus, DollarSign, Gift, Calendar as CalendarIcon, MapPin, Users, Video } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/events/")({
  component: AdminEventsPage,
});

interface PendingEvent {
  id: number;
  creatorId: number;
  creatorName: string;
  creatorType: "learner" | "mentor";
  title: string;
  description: string;
  dateFrom: string;
  dateTo: string;
  timeFrom: string;
  timeTo: string;
  isMultiDay: boolean;
  location: string;
  expectedAttendees: number;
  submittedAt: string;
  status: "pending" | "verified" | "rejected";
  isFree: boolean;
  price: number;
  isVirtual: boolean;
}

// Mock pending events
const MOCK_PENDING_EVENTS: PendingEvent[] = [
  // Mentor-created events
  { id: 1, creatorId: 3, creatorName: "Jose Reyes", creatorType: "mentor", title: "Filipino Cultural Workshop", description: "Learn about traditional Filipino customs", dateFrom: "2024-03-25", dateTo: "2024-03-25", timeFrom: "10:00", timeTo: "17:00", isMultiDay: false, location: "Online", expectedAttendees: 50, submittedAt: "2024-03-14", status: "pending", isFree: true, price: 0, isVirtual: true },
  { id: 2, creatorId: 4, creatorName: "Ana Cruz", creatorType: "mentor", title: "Filipino Cooking Class", description: "Learn to cook adobo and sinigang", dateFrom: "2024-03-28", dateTo: "2024-03-28", timeFrom: "14:00", timeTo: "18:00", isMultiDay: false, location: "Makati City", expectedAttendees: 30, submittedAt: "2024-03-13", status: "pending", isFree: false, price: 500, isVirtual: false },
  
  // Learner-created events
  { id: 3, creatorId: 1, creatorName: "Maria Santos", creatorType: "learner", title: "Tagalog Study Group", description: "Weekly meetup to practice Tagalog conversation", dateFrom: "2024-03-30", dateTo: "2024-03-30", timeFrom: "15:00", timeTo: "17:00", isMultiDay: false, location: "Coffee Shop, Makati", expectedAttendees: 15, submittedAt: "2024-03-15", status: "pending", isFree: true, price: 0, isVirtual: false },
  { id: 4, creatorId: 2, creatorName: "John Reyes", creatorType: "learner", title: "History Discussion Night", description: "Group discussion about Philippine Revolution", dateFrom: "2024-04-02", dateTo: "2024-04-02", timeFrom: "18:00", timeTo: "20:00", isMultiDay: false, location: "Online (Zoom)", expectedAttendees: 25, submittedAt: "2024-03-14", status: "pending", isFree: true, price: 0, isVirtual: true },
  
  // Verified events
  { id: 5, creatorId: 8, creatorName: "Miguel Santos", creatorType: "mentor", title: "Digital Art Workshop", description: "Learn digital art techniques", dateFrom: "2024-03-20", dateTo: "2024-03-22", timeFrom: "09:00", timeTo: "17:00", isMultiDay: true, location: "Online", expectedAttendees: 100, submittedAt: "2024-03-10", status: "verified", isFree: false, price: 1500, isVirtual: true },
];

function AdminEventsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [events, setEvents] = useState<PendingEvent[]>(MOCK_PENDING_EVENTS);
  const [selectedEvent, setSelectedEvent] = useState<PendingEvent | null>(null);
  const [editingEvent, setEditingEvent] = useState<PendingEvent | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredEvents = events.filter(event => {
    const matchesSearch = search === "" || 
      event.title.toLowerCase().includes(search.toLowerCase()) ||
      event.creatorName.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || event.status === statusFilter;
    const matchesType = typeFilter === "all" || event.creatorType === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const paginatedEvents = filteredEvents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter, typeFilter]);

  const stats = {
    total: events.length,
    pending: events.filter(e => e.status === "pending").length,
    verified: events.filter(e => e.status === "verified").length,
    rejected: events.filter(e => e.status === "rejected").length,
    mentorEvents: events.filter(e => e.creatorType === "mentor").length,
    learnerEvents: events.filter(e => e.creatorType === "learner").length,
  };

  const handleVerifyEvent = (eventId: number) => {
    setEvents(prev =>
      prev.map(event =>
        event.id === eventId ? { ...event, status: "verified" } : event
      )
    );
    toast.success(`Event "${events.find(e => e.id === eventId)?.title}" verified!`);
    setSelectedEvent(null);
  };

  const handleRejectEvent = (eventId: number) => {
    setEvents(prev =>
      prev.map(event =>
        event.id === eventId ? { ...event, status: "rejected" } : event
      )
    );
    toast.info(`Event "${events.find(e => e.id === eventId)?.title}" rejected.`);
    setSelectedEvent(null);
  };

  const handleEditEvent = (event: PendingEvent) => {
    setEditingEvent({ ...event });
    setSelectedEvent(null);
  };

  const handleSaveEdit = () => {
    if (editingEvent) {
      setEvents(prev =>
        prev.map(event =>
          event.id === editingEvent.id ? editingEvent : event
        )
      );
      toast.success(`Event "${editingEvent.title}" updated successfully!`);
      setEditingEvent(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingEvent(null);
  };

  const handleEditField = (field: keyof PendingEvent, value: string | number | boolean) => {
    if (editingEvent) {
      setEditingEvent({ ...editingEvent, [field]: value });
    }
  };

  const handleAddEvent = () => {
    const newId = Math.max(...events.map(e => e.id), 0) + 1;
    
    const newEvent: PendingEvent = {
      id: newId,
      creatorId: 999,
      creatorName: "Admin",
      creatorType: "mentor",
      title: "New Event",
      description: "",
      dateFrom: new Date().toISOString().split('T')[0],
      dateTo: new Date().toISOString().split('T')[0],
      timeFrom: "09:00",
      timeTo: "17:00",
      isMultiDay: false,
      location: "",
      expectedAttendees: 0,
      submittedAt: new Date().toISOString().split('T')[0],
      status: "pending",
      isFree: true,
      price: 0,
      isVirtual: false,
    };
    
    setEvents(prev => [newEvent, ...prev]);
    setEditingEvent(newEvent);
    toast.success("New event created! Fill in the details below.");
  };

  const handleDeleteEvent = (eventId: number) => {
    const eventToDelete = events.find(e => e.id === eventId);
    if (confirm(`Are you sure you want to delete "${eventToDelete?.title}"?`)) {
      setEvents(prev => prev.filter(event => event.id !== eventId));
      toast.error(`Event "${eventToDelete?.title}" deleted.`);
      setEditingEvent(null);
      setSelectedEvent(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-700"><Clock className="h-3 w-3" /> Pending</span>;
      case "verified":
        return <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-green-100 text-green-700"><CheckCircle className="h-3 w-3" /> Verified</span>;
      case "rejected":
        return <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-red-100 text-red-700"><XCircle className="h-3 w-3" /> Rejected</span>;
      default:
        return null;
    }
  };

  const formatEventDateTime = (event: PendingEvent) => {
    if (event.isMultiDay) {
      return `${event.dateFrom} to ${event.dateTo} • ${event.timeFrom} - ${event.timeTo}`;
    }
    return `${event.dateFrom} • ${event.timeFrom} - ${event.timeTo}`;
  };

  return (
    <AdminDashboardLayout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Link to="/admin" className="hover:text-red-600 transition-colors">
              Dashboard
            </Link>
            <span>/</span>
            <span className="text-foreground font-medium">Event Management</span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-serif text-3xl font-bold text-navy">Event Management</h1>
              <p className="text-muted-foreground mt-1">Verify events created by learners and mentors</p>
            </div>
            <Button onClick={handleAddEvent} className="bg-gold hover:bg-gold/90 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Add Event
            </Button>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid gap-4 md:grid-cols-5 mb-6">
          <div className="rounded-lg border border-border bg-card p-3">
            <p className="text-2xl font-bold text-navy">{stats.total}</p>
            <p className="text-xs text-muted-foreground">Total Events</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-3">
            <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
            <p className="text-xs text-muted-foreground">Pending Verification</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-3">
            <p className="text-2xl font-bold text-green-600">{stats.verified}</p>
            <p className="text-xs text-muted-foreground">Verified</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-3">
            <p className="text-2xl font-bold text-blue-600">{stats.mentorEvents}</p>
            <p className="text-xs text-muted-foreground">Mentor Events</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-3">
            <p className="text-2xl font-bold text-purple-600">{stats.learnerEvents}</p>
            <p className="text-xs text-muted-foreground">Learner Events</p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by event title or creator..."
              className="w-full rounded-lg border border-border bg-background pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="verified">Verified</option>
            <option value="rejected">Rejected</option>
          </select>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="rounded-lg border border-border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="all">All Types</option>
            <option value="learner">Learner Events</option>
            <option value="mentor">Mentor Events</option>
          </select>
          <Button variant="outline" onClick={() => {
            setSearch("");
            setStatusFilter("all");
            setTypeFilter("all");
          }}>
            <Filter className="h-4 w-4 mr-2" />
            Clear Filters
          </Button>
        </div>

        {/* Events Table */}
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Event Title</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Creator</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Date & Time</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Location</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Attendees</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Price</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {paginatedEvents.map((event) => (
                  <tr key={event.id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-4 py-3 text-sm font-medium">{event.title}</td>
                    <td className="px-4 py-3 text-sm">{event.creatorName}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full ${event.creatorType === "mentor" ? "bg-gold/10 text-gold" : "bg-blue-100 text-blue-600"}`}>
                        {event.creatorType === "mentor" ? "Mentor" : "Learner"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      {formatEventDateTime(event)}
                    </td>
                    <td className="px-4 py-3 text-sm">{event.location}</td>
                    <td className="px-4 py-3 text-sm">{event.expectedAttendees}</td>
                    <td className="px-4 py-3 text-sm">
                      {event.isFree ? (
                        <span className="text-green-600 font-medium">Free</span>
                      ) : (
                        <span className="text-gold font-medium">₱{event.price}</span>
                      )}
                    </td>
                    <td className="px-4 py-3">{getStatusBadge(event.status)}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => setSelectedEvent(event)}
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          Review
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleEditEvent(event)}
                        >
                          <Edit className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-4 py-3 border-t border-border">
            <Pagination
              currentPage={currentPage}
              totalItems={filteredEvents.length}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
              showEntries={true}
            />
          </div>
        </div>

        {filteredEvents.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No events found matching your criteria.</p>
            <Button onClick={handleAddEvent} className="mt-4 bg-gold hover:bg-gold/90 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Event
            </Button>
          </div>
        )}
      </div>

      {/* Edit/Create Event Modal */}
      {editingEvent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="p-6 border-b border-border flex justify-between items-center sticky top-0 bg-background">
              <h2 className="font-serif text-2xl font-bold text-navy">
                {editingEvent.id > Math.max(...events.map(e => e.id), 0) - 10 ? "Create New Event" : "Edit Event"}
              </h2>
              <button
                onClick={handleCancelEdit}
                className="text-muted-foreground hover:text-foreground p-1 rounded-lg hover:bg-muted transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                {/* Title */}
                <div className="col-span-2">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-2">Event Title *</label>
                  <input
                    type="text"
                    value={editingEvent.title}
                    onChange={(e) => handleEditField("title", e.target.value)}
                    className="w-full rounded-lg border border-border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Enter event title"
                  />
                </div>

                {/* Description */}
                <div className="col-span-2">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-2">Description *</label>
                  <textarea
                    value={editingEvent.description}
                    onChange={(e) => handleEditField("description", e.target.value)}
                    rows={4}
                    className="w-full rounded-lg border border-border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Describe the event..."
                  />
                </div>

                {/* Multi-day Toggle */}
                <div className="col-span-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingEvent.isMultiDay}
                      onChange={(e) => handleEditField("isMultiDay", e.target.checked)}
                      className="h-4 w-4 rounded border-border text-gold focus:ring-gold"
                    />
                    <span className="text-sm font-medium text-navy flex items-center gap-1">
                      <CalendarIcon className="h-4 w-4" /> This is a multi-day event (2+ days)
                    </span>
                  </label>
                </div>

                {/* Date Fields */}
                <div>
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-2 flex items-center gap-1">
                    <CalendarIcon className="h-3 w-3" /> {editingEvent.isMultiDay ? "Start Date *" : "Date *"}
                  </label>
                  <input
                    type="date"
                    value={editingEvent.dateFrom}
                    onChange={(e) => handleEditField("dateFrom", e.target.value)}
                    className="w-full rounded-lg border border-border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>

                {editingEvent.isMultiDay && (
                  <div>
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-2 flex items-center gap-1">
                      <CalendarIcon className="h-3 w-3" /> End Date *
                    </label>
                    <input
                      type="date"
                      value={editingEvent.dateTo}
                      onChange={(e) => handleEditField("dateTo", e.target.value)}
                      min={editingEvent.dateFrom}
                      className="w-full rounded-lg border border-border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                )}

                {/* Time Fields */}
                <div>
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-2 flex items-center gap-1">
                    <Clock className="h-3 w-3" /> Start Time *
                  </label>
                  <input
                    type="time"
                    value={editingEvent.timeFrom}
                    onChange={(e) => handleEditField("timeFrom", e.target.value)}
                    className="w-full rounded-lg border border-border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-2 flex items-center gap-1">
                    <Clock className="h-3 w-3" /> End Time *
                  </label>
                  <input
                    type="time"
                    value={editingEvent.timeTo}
                    onChange={(e) => handleEditField("timeTo", e.target.value)}
                    className="w-full rounded-lg border border-border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>

                {/* Location */}
                <div className="col-span-2">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-2 flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> Location *
                  </label>
                  <input
                    type="text"
                    value={editingEvent.location}
                    onChange={(e) => handleEditField("location", e.target.value)}
                    className="w-full rounded-lg border border-border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="e.g., Zoom, Makati City, Manila..."
                  />
                </div>

                {/* Virtual Event Toggle */}
                <div className="col-span-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingEvent.isVirtual}
                      onChange={(e) => handleEditField("isVirtual", e.target.checked)}
                      className="h-4 w-4 rounded border-border text-gold focus:ring-gold"
                    />
                    <span className="text-sm font-medium text-navy flex items-center gap-1">
                      <Video className="h-4 w-4" /> This is a virtual event
                    </span>
                  </label>
                </div>

                {/* Expected Attendees */}
                <div>
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-2 flex items-center gap-1">
                    <Users className="h-3 w-3" /> Expected Attendees
                  </label>
                  <input
                    type="number"
                    value={editingEvent.expectedAttendees}
                    onChange={(e) => handleEditField("expectedAttendees", parseInt(e.target.value) || 0)}
                    className="w-full rounded-lg border border-border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                    min="0"
                  />
                </div>

                {/* Price - Free/Paid Toggle */}
                <div>
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-2">Price</label>
                  <div className="flex gap-2 mb-2">
                    <button
                      type="button"
                      onClick={() => {
                        handleEditField("isFree", true);
                        handleEditField("price", 0);
                      }}
                      className={`flex-1 px-3 py-2 rounded-md text-sm transition ${
                        editingEvent.isFree 
                          ? "bg-green-500 text-white" 
                          : "bg-muted text-muted-foreground hover:bg-green-100"
                      }`}
                    >
                      <Gift className="h-4 w-4 inline mr-1" />
                      Free
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        handleEditField("isFree", false);
                        if (editingEvent.price === 0) handleEditField("price", 100);
                      }}
                      className={`flex-1 px-3 py-2 rounded-md text-sm transition ${
                        !editingEvent.isFree 
                          ? "bg-gold text-white" 
                          : "bg-muted text-muted-foreground hover:bg-gold/20"
                      }`}
                    >
                      <DollarSign className="h-4 w-4 inline mr-1" />
                      Paid
                    </button>
                  </div>
                  {!editingEvent.isFree && (
                    <input
                      type="number"
                      value={editingEvent.price}
                      onChange={(e) => handleEditField("price", parseInt(e.target.value) || 0)}
                      placeholder="Price in ₱"
                      className="w-full rounded-lg border border-border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                      min="1"
                    />
                  )}
                </div>

                {/* Creator Info */}
                <div>
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-2">Creator Name</label>
                  <input
                    type="text"
                    value={editingEvent.creatorName}
                    onChange={(e) => handleEditField("creatorName", e.target.value)}
                    className="w-full rounded-lg border border-border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-2">Creator Type</label>
                  <select
                    value={editingEvent.creatorType}
                    onChange={(e) => handleEditField("creatorType", e.target.value as "learner" | "mentor")}
                    className="w-full rounded-lg border border-border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value="learner">Learner</option>
                    <option value="mentor">Mentor</option>
                  </select>
                </div>

                {/* Status - ONLY SHOW FOR EDITING, NOT FOR CREATE */}
                {editingEvent.id <= Math.max(...events.map(e => e.id), 0) - 10 ? (
                  // This is an existing event, show status
                  <div>
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-2">Status</label>
                    <select
                      value={editingEvent.status}
                      onChange={(e) => handleEditField("status", e.target.value as "pending" | "verified" | "rejected")}
                      className="w-full rounded-lg border border-border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      <option value="pending">Pending</option>
                      <option value="verified">Verified</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                ) : (
                  // This is a new event, show message instead
                  <div>
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-2">Status</label>
                    <div className="px-4 py-2 text-sm bg-yellow-50 text-yellow-700 rounded-lg border border-yellow-200">
                      <Clock className="h-3 w-3 inline mr-1" /> Pending (will be set automatically)
                    </div>
                  </div>
                )}

                {/* Submitted Date - ONLY SHOW FOR EDITING */}
                {editingEvent.id <= Math.max(...events.map(e => e.id), 0) - 10 && (
                  <div>
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-2">Submitted Date</label>
                    <input
                      type="date"
                      value={editingEvent.submittedAt}
                      onChange={(e) => handleEditField("submittedAt", e.target.value)}
                      className="w-full rounded-lg border border-border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4 border-t border-border">
                <Button
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={handleSaveEdit}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {editingEvent.id > Math.max(...events.map(e => e.id), 0) - 10 ? "Create Event" : "Save Changes"}
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 border-red-500 text-red-600 hover:bg-red-50"
                  onClick={() => handleDeleteEvent(editingEvent.id)}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Delete Event
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={handleCancelEdit}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Review Event Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-border flex justify-between items-center sticky top-0 bg-background">
              <h2 className="font-serif text-2xl font-bold text-navy">Review Event</h2>
              <button
                onClick={() => setSelectedEvent(null)}
                className="text-muted-foreground hover:text-foreground p-1 rounded-lg hover:bg-muted transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Title</label>
                  <p className="text-lg font-semibold text-navy mt-1">{selectedEvent.title}</p>
                </div>
                <div className="col-span-2">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Date & Time</label>
                  <p className="font-medium mt-1">{formatEventDateTime(selectedEvent)}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Expected Attendees</label>
                  <p className="font-medium mt-1">{selectedEvent.expectedAttendees}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Price</label>
                  <p className="font-medium mt-1">
                    {selectedEvent.isFree ? "Free" : `₱${selectedEvent.price}`}
                  </p>
                </div>
                <div className="col-span-2">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Location</label>
                  <p className="font-medium mt-1">{selectedEvent.location}</p>
                  {selectedEvent.isVirtual && (
                    <span className="inline-flex items-center gap-1 text-xs mt-1 text-blue-600"><Video className="h-3 w-3" /> Virtual Event</span>
                  )}
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Created By</label>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="font-medium">{selectedEvent.creatorName}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${selectedEvent.creatorType === "mentor" ? "bg-gold/10 text-gold" : "bg-blue-100 text-blue-600"}`}>
                      {selectedEvent.creatorType === "mentor" ? "Mentor" : "Learner"}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Submitted</label>
                  <p className="font-medium mt-1">{selectedEvent.submittedAt}</p>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Description</label>
                <div className="mt-2 p-4 bg-muted/20 rounded-lg">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {selectedEvent.description || "No description provided."}
                  </p>
                </div>
              </div>

              <div className="flex gap-4 pt-4 border-t border-border">
                <Button
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                  onClick={() => handleVerifyEvent(selectedEvent.id)}
                  disabled={selectedEvent.status !== "pending"}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Verify Event
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 border-red-500 text-red-600 hover:bg-red-50"
                  onClick={() => handleRejectEvent(selectedEvent.id)}
                  disabled={selectedEvent.status !== "pending"}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject Event
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminDashboardLayout>
  );
}