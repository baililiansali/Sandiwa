import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { MentorDashboardLayout } from "@/components/MentorDashboardLayout";
import { AuthGuard } from "@/components/AuthGuard";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, MapPin, Users, Video, DollarSign, Clock, CreditCard, Gift } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Event } from "@/data/mockEvents";

type Category = "workshop" | "meetup" | "celebration" | "conversation";

export const Route = createFileRoute("/mentor/community/events/create")({
  head: () => ({
    meta: [
      { title: "Create Event — Sandiwa Mentor" },
      { name: "description", content: "Host a community event." },
    ],
  }),
  component: CreateEventPage,
});

function CreateEventPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFree, setIsFree] = useState(true);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [timeFrom, setTimeFrom] = useState("");
  const [timeTo, setTimeTo] = useState("");
  const [isMultiDay, setIsMultiDay] = useState(false);
  const [location, setLocation] = useState("");
  const [isVirtual, setIsVirtual] = useState(false);
  const [capacity, setCapacity] = useState("");
  const [price, setPrice] = useState("0");
  const [image, setImage] = useState("");
  const [category, setCategory] = useState<Category>("workshop");

  const categories = [
    { value: "workshop", label: "Workshop" },
    { value: "meetup", label: "Meetup" },
    { value: "celebration", label: "Celebration" },
    { value: "conversation", label: "Conversation" },
  ];

  const handleFreeToggle = (free: boolean) => {
    setIsFree(free);
    setPrice(free ? "0" : "100");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast.error("Please enter an event title");
      return;
    }
    
    if (!description.trim()) {
      toast.error("Please enter a description");
      return;
    }
    
    if (!dateFrom) {
      toast.error("Please select a start date");
      return;
    }
    
    if (isMultiDay && !dateTo) {
      toast.error("Please select an end date");
      return;
    }
    
    if (isMultiDay && dateTo && new Date(dateTo) < new Date(dateFrom)) {
      toast.error("End date cannot be before start date");
      return;
    }
    
    if (!timeFrom) {
      toast.error("Please select a start time");
      return;
    }
    
    if (!timeTo) {
      toast.error("Please select an end time");
      return;
    }
    
    if (timeTo <= timeFrom && dateFrom === dateTo) {
      toast.error("End time must be after start time");
      return;
    }
    
    if (!location.trim()) {
      toast.error("Please enter a location");
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const mentorName = localStorage.getItem("userName") || sessionStorage.getItem("userName") || "Mentor";
      const mentorId = localStorage.getItem("mentorId") || sessionStorage.getItem("mentorId") || "mentor_001";

      const startDateTime = new Date(`${dateFrom}T${timeFrom}`);
      const endDateTime = isMultiDay && dateTo 
        ? new Date(`${dateTo}T${timeTo}`)
        : new Date(`${dateFrom}T${timeTo}`);

      const newEvent: Event = {
        id: `event_${Date.now()}`,
        title: title.trim(),
        description: description.trim(),
        date: startDateTime,
        dateTo: endDateTime,
        location: location.trim(),
        isVirtual: isVirtual,
        price: parseFloat(price) || 0,
        capacity: capacity ? parseInt(capacity) : undefined,
        registered: 0,
        image: image || "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&h=400&fit=crop",
        category: category,
        mentorId: mentorId,
        mentorName: mentorName,
      };

      const existingEvents = JSON.parse(localStorage.getItem("sandiwa.events") || "[]");
      existingEvents.push(newEvent);
      localStorage.setItem("sandiwa.events", JSON.stringify(existingEvents));

      toast.success("Event created successfully!");
      setIsSubmitting(false);
      
      setTimeout(() => {
        navigate({ to: "/mentor/community/events" });
      }, 500);
    }, 1000);
  };

  const handleGoBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      navigate({ to: "/mentor/community/events" });
    }
  };

  return (
    <AuthGuard>
      <MentorDashboardLayout>
        <section className="bg-cream py-10">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <button
              onClick={handleGoBack}
              className="inline-flex items-center gap-2 text-sm text-foreground/70 hover:text-gold mb-6 cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </button>

            <div className="rounded-xl border border-border bg-card p-6 md:p-8">
              <h1 className="font-serif text-3xl font-bold text-navy">Create New Event</h1>
              <p className="mt-2 text-muted-foreground">
                Host a workshop, meetup, or cultural celebration
              </p>

              <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                <div>
                  <label className="mb-1 block text-sm font-medium text-navy">
                    Event Title *
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Filipino Cooking Workshop"
                    className="w-full rounded-md border border-border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                    maxLength={100}
                    required
                  />
                  <p className="mt-1 text-xs text-muted-foreground">
                    {title.length}/100 characters
                  </p>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-navy">
                    Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as Category)}
                    className="w-full rounded-md border border-border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                    required
                  >
                    {categories.map((cat) => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-navy">
                    Description *
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={5}
                    placeholder="Describe what attendees will learn and experience..."
                    className="w-full rounded-md border border-border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                    maxLength={2000}
                    required
                  />
                  <p className="mt-1 text-xs text-muted-foreground">
                    {description.length}/2000 characters
                  </p>
                </div>

                {/* Multi-day Event Toggle */}
                <div>
                  <label className="flex items-center gap-2 cursor-pointer mb-4">
                    <input
                      type="checkbox"
                      checked={isMultiDay}
                      onChange={(e) => setIsMultiDay(e.target.checked)}
                      className="h-4 w-4 rounded border-border text-gold focus:ring-gold"
                    />
                    <span className="text-sm font-medium text-navy flex items-center gap-1">
                      <Calendar className="h-4 w-4" /> This is a multi-day event (2+ days)
                    </span>
                  </label>
                </div>

                {/* Date Fields */}
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-navy flex items-center gap-1">
                      <Calendar className="h-4 w-4" /> {isMultiDay ? "Start Date *" : "Date *"}
                    </label>
                    <input
                      type="date"
                      value={dateFrom}
                      onChange={(e) => setDateFrom(e.target.value)}
                      className="w-full rounded-md border border-border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                      required
                    />
                  </div>
                  
                  {isMultiDay && (
                    <div>
                      <label className="mb-1 block text-sm font-medium text-navy flex items-center gap-1">
                        <Calendar className="h-4 w-4" /> End Date *
                      </label>
                      <input
                        type="date"
                        value={dateTo}
                        onChange={(e) => setDateTo(e.target.value)}
                        min={dateFrom}
                        className="w-full rounded-md border border-border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                        required
                      />
                    </div>
                  )}
                </div>

                {/* Time Fields - Always show both from and to */}
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-navy flex items-center gap-1">
                      <Clock className="h-4 w-4" /> Start Time *
                    </label>
                    <input
                      type="time"
                      value={timeFrom}
                      onChange={(e) => setTimeFrom(e.target.value)}
                      className="w-full rounded-md border border-border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="mb-1 block text-sm font-medium text-navy flex items-center gap-1">
                      <Clock className="h-4 w-4" /> End Time *
                    </label>
                    <input
                      type="time"
                      value={timeTo}
                      onChange={(e) => setTimeTo(e.target.value)}
                      className="w-full rounded-md border border-border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-navy flex items-center gap-1">
                    <MapPin className="h-4 w-4" /> Location *
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g., Zoom, Quezon City, Manila..."
                    className="w-full rounded-md border border-border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                    required
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-navy flex items-center gap-1">
                      <Users className="h-4 w-4" /> Capacity (optional)
                    </label>
                    <input
                      type="number"
                      value={capacity}
                      onChange={(e) => setCapacity(e.target.value)}
                      placeholder="Max attendees"
                      className="w-full rounded-md border border-border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                      min="1"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-navy flex items-center gap-1">
                      {isFree ? <Gift className="h-4 w-4 text-green-500" /> : <DollarSign className="h-4 w-4 text-gold" />}
                      Price
                    </label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleFreeToggle(true)}
                        className={`flex-1 px-3 py-2 rounded-md text-sm transition ${
                          isFree 
                            ? "bg-green-500 text-white" 
                            : "bg-muted text-muted-foreground hover:bg-green-100"
                        }`}
                      >
                        <Gift className="h-4 w-4 inline mr-1" />
                        Free
                      </button>
                      <button
                        type="button"
                        onClick={() => handleFreeToggle(false)}
                        className={`flex-1 px-3 py-2 rounded-md text-sm transition ${
                          !isFree 
                            ? "bg-gold text-white" 
                            : "bg-muted text-muted-foreground hover:bg-gold/20"
                        }`}
                      >
                        <CreditCard className="h-4 w-4 inline mr-1" />
                        Paid
                      </button>
                    </div>
                    {!isFree && (
                      <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="Price in ₱"
                        className="mt-2 w-full rounded-md border border-border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                        min="1"
                      />
                    )}
                  </div>
                </div>

                <div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isVirtual}
                      onChange={(e) => setIsVirtual(e.target.checked)}
                      className="h-4 w-4 rounded border-border text-gold focus:ring-gold"
                    />
                    <span className="text-sm font-medium text-navy flex items-center gap-1">
                      <Video className="h-4 w-4" /> This is a virtual event
                    </span>
                  </label>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-navy">Event Image URL (optional)</label>
                  <input
                    type="url"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    className="w-full rounded-md border border-border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                  />
                  <p className="mt-1 text-xs text-muted-foreground">
                    Leave empty to use default event image
                  </p>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-gold hover:bg-gold/90 text-white"
                  >
                    {isSubmitting ? "Creating..." : "Create Event"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleGoBack}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </section>
      </MentorDashboardLayout>
    </AuthGuard>
  );
}