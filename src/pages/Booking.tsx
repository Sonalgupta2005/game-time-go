import { useState } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Clock, MapPin, CreditCard, CheckCircle } from "lucide-react";
import { format } from "date-fns";

// Mock data
const venueData = {
  id: 1,
  name: "Elite Sports Complex",
  location: "Downtown, City Center",
  courts: [
    { id: 1, name: "Court 1", sport: "Badminton", pricePerHour: 25 },
    { id: 2, name: "Court 2", sport: "Badminton", pricePerHour: 25 },
    { id: 3, name: "Tennis Court A", sport: "Tennis", pricePerHour: 40 },
  ]
};

const timeSlots = [
  "06:00", "07:00", "08:00", "09:00", "10:00", "11:00",
  "12:00", "13:00", "14:00", "15:00", "16:00", "17:00",
  "18:00", "19:00", "20:00", "21:00", "22:00"
];

const Booking = () => {
  const { venueId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedCourt, setSelectedCourt] = useState(searchParams.get('court') || "");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
  const [duration, setDuration] = useState("1");
  const [isBooking, setIsBooking] = useState(false);

  // Time slots pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const totalPages = Math.ceil(timeSlots.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedTimeSlots = timeSlots.slice(startIndex, startIndex + itemsPerPage);

  const selectedCourtData = venueData.courts.find(court => court.id.toString() === selectedCourt);
  const totalPrice = selectedCourtData ? selectedCourtData.pricePerHour * parseInt(duration) : 0;

  const handleBooking = async () => {
    if (!selectedDate || !selectedCourt || !selectedTimeSlot) return;

    setIsBooking(true);
    
    try {
      // API call to Node.js backend for booking
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify({
          venueId,
          courtId: selectedCourt,
          date: selectedDate.toISOString().split('T')[0],
          timeSlot: selectedTimeSlot,
          duration: parseInt(duration),
          totalPrice: totalPrice,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast("Booking confirmed successfully!");
        navigate("/profile");
      } else {
        toast(data.message || "Booking failed. Please try again.");
      }
    } catch (error) {
      console.error('Booking error:', error);
      toast("Network error. Please try again.");
    } finally {
      setIsBooking(false);
    }
  };

  const canBook = selectedDate && selectedCourt && selectedTimeSlot && !isBooking;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Book Your Court</h1>
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{venueData.name} - {venueData.location}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Court Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                    1
                  </div>
                  Select Court
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-3">
                  {venueData.courts.map((court) => (
                    <div
                      key={court.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-smooth ${
                        selectedCourt === court.id.toString()
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                      onClick={() => setSelectedCourt(court.id.toString())}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">{court.name}</h3>
                          <p className="text-sm text-muted-foreground">{court.sport}</p>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-primary">₹{court.pricePerHour}</div>
                          <div className="text-xs text-muted-foreground">per hour</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Date Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                    2
                  </div>
                  Select Date
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) => date < new Date()}
                  className="rounded-md border pointer-events-auto"
                />
              </CardContent>
            </Card>

            {/* Time Slot Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                    3
                  </div>
                  Select Time & Duration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Start Time</label>
                  <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                    {displayedTimeSlots.map((time) => (
                      <Button
                        key={time}
                        variant={selectedTimeSlot === time ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedTimeSlot(time)}
                        className="text-xs"
                      >
                        {time}
                      </Button>
                    ))}
                  </div>

                  <Pagination className="mt-3">
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            setCurrentPage((p) => Math.max(1, p - 1));
                          }}
                        />
                      </PaginationItem>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <PaginationItem key={page}>
                          <PaginationLink
                            href="#"
                            isActive={page === currentPage}
                            onClick={(e) => {
                              e.preventDefault();
                              setCurrentPage(page);
                            }}
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      ))}
                      <PaginationItem>
                        <PaginationNext
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            setCurrentPage((p) => Math.min(totalPages, p + 1));
                          }}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Duration</label>
                  <Select value={duration} onValueChange={setDuration}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 hour</SelectItem>
                      <SelectItem value="2">2 hours</SelectItem>
                      <SelectItem value="3">3 hours</SelectItem>
                      <SelectItem value="4">4 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Booking Summary */}
          <div>
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Venue Info */}
                <div>
                  <h4 className="font-medium mb-2">Venue</h4>
                  <p className="text-sm text-muted-foreground">{venueData.name}</p>
                </div>

                {selectedCourtData && (
                  <>
                    <Separator />
                    <div>
                      <h4 className="font-medium mb-2">Court</h4>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">{selectedCourtData.name}</span>
                        <Badge variant="secondary">{selectedCourtData.sport}</Badge>
                      </div>
                    </div>
                  </>
                )}

                {selectedDate && (
                  <>
                    <Separator />
                    <div>
                      <h4 className="font-medium mb-2">Date & Time</h4>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <p>{format(selectedDate, "EEEE, MMMM do, yyyy")}</p>
                        {selectedTimeSlot && (
                          <p className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {selectedTimeSlot} - {String(parseInt(selectedTimeSlot.split(':')[0]) + parseInt(duration)).padStart(2, '0')}:00
                          </p>
                        )}
                      </div>
                    </div>
                  </>
                )}

                {totalPrice > 0 && (
                  <>
                    <Separator />
                    <div>
                      <h4 className="font-medium mb-2">Pricing</h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span>Rate per hour</span>
                          <span>₹{selectedCourtData?.pricePerHour}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Duration</span>
                          <span>{duration} hour{parseInt(duration) > 1 ? 's' : ''}</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between font-medium text-base">
                          <span>Total</span>
                          <span className="text-primary">₹{totalPrice}</span>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                <Separator />

                <Button 
                  className="w-full" 
                  variant="hero" 
                  disabled={!canBook}
                  onClick={handleBooking}
                >
                  {isBooking ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Booking...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      Confirm Booking
                    </div>
                  )}
                </Button>

                <div className="text-xs text-muted-foreground text-center">
                  By booking, you agree to our terms and conditions
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Booking;