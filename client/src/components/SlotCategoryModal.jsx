import SlotCard from "./SlotCard";

export default function SlotCategoryModal({
  show,
  title,
  slots,
  onClose,
  onBook,
}) {
  if (!show) return null;

  return (
    
<div
  className="modal fade show"
  style={{
    display: "block",
    background:
      "rgba(0,0,0,0.6)",
    zIndex: 11000,
  }}

    ><div className="modal-dialog modal-xl modal-dialog-scrollable modal-fullscreen-md-down">

        <div className="modal-content border-0 shadow">

          <div className="modal-header">

            <h4 className="mb-0">
              {title}
            </h4>

            <button
              className="btn-close"
              onClick={onClose}
            />

          </div>

          <div className="modal-body">

            {slots.length ===
            0 ? (
              <p>
                No slots found
              </p>
            ) : (
              <div className="row">

                {slots.map(
                  (slot) => (
                    <SlotCard
                      key={slot._id}
                      slot={slot}
                      onBook={
                        onBook
                      }
                    />
                  )
                )}

              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}