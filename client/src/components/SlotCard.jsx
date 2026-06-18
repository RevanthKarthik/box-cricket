export default function SlotCard({
  slot,
  onBook,
}) {
  const startTime =
  new Date(
    slot.startTime
  ).toLocaleTimeString(
    "en-IN",
    {
      timeZone:
        "Asia/Kolkata",
      hour: "2-digit",
      minute: "2-digit",
    }
  );

const endTime =
  new Date(
    slot.endTime
  ).toLocaleTimeString(
    "en-IN",
    {
      timeZone:
        "Asia/Kolkata",
      hour: "2-digit",
      minute: "2-digit",
    }
  );

  const getStatusColor = () => {
    switch (
      slot.status
    ) {
      case "available":
        return "success";

      case "booked":
        return "danger";

      case "blocked":
        return "warning";
      case "hold":
  return "warning";
      default:
        return "secondary";
    }
  };

  return (
    <div className="col-lg-6 mb-3">

      <div
        className="card border-0 shadow-sm"
        style={{
          borderRadius: "18px",
        }}
      >

        <div className="card-body">

          <div className="d-flex justify-content-between align-items-center">
<div>

  <h5 className="fw-bold mb-1">
    {startTime}
  </h5>

  <small className="text-muted d-block">
    to {endTime}
  </small>

  <small
    className="text-secondary"
    style={{
      fontSize: "0.72rem",
      fontWeight: "600",
    }}
  >
    {new Date(
      slot.startTime
    ).toLocaleDateString(
      "en-IN",
      {
        weekday: "short",
        day: "numeric",
        month: "short",
      }
    )}
  </small>

</div>

            <div className="text-end">

              <h4 className="text-success fw-bold mb-1">
                ₹{slot.price}
              </h4>
<span
  className={`badge bg-${getStatusColor()}`}
>
  {slot.status === "hold"
    ? "Reserved"
    : slot.status}
</span>
        

            </div>

          </div>

          <hr />

          {slot.status ===
          "available" ? (
            <button
              className="btn btn-success w-100"
              onClick={() =>
                onBook(slot)
              }
            >
              Book Now
            </button>
          ) : (
            <button
  disabled
  className="btn btn-secondary w-100"
>
  {slot.status === "booked"
    ? "Booked"
    : slot.status === "hold"
    ? "Reserved"
    : "Unavailable"}
</button>
          )}

        </div>

      </div>

    </div>
  );
}
