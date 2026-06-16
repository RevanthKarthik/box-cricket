import { useEffect, useState } from "react";
import AdminNavbar from "../components/AdminNavbar";
import api from "../services/api";

export default function AdminGallery() {
  const [images, setImages] =
    useState([]);

  const [file, setFile] =
    useState(null);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages =
    async () => {
      try {
        const res =
          await api.get(
            "/gallery"
          );

        setImages(
          res.data
        );
      } catch (error) {
        console.log(error);
      }
    };

  const uploadImage =
    async () => {
      if (!file) {
        alert(
          "Select an image"
        );
        return;
      }

      const formData =
        new FormData();

      formData.append(
        "image",
        file
      );

      try {
        await api.post(
          "/gallery",
          formData,
          {
            headers: {
              "Content-Type":
                "multipart/form-data",
            },
          }
        );

        setFile(null);

        fetchImages();

        alert(
          "Image uploaded successfully"
        );
      } catch (error) {
        console.log(error);
      }
    };

  const deleteImage =
    async (id) => {
      if (
        !window.confirm(
          "Delete image?"
        )
      )
        return;

      try {
        await api.delete(
          `/gallery/${id}`
        );

        fetchImages();
      } catch (error) {
        console.log(error);
      }
    };

  return (
    <>
      <AdminNavbar/>

      <div
  className="container py-4"
  style={{
    paddingBottom: "80px",
  }}
>

        <h2>
          Gallery Management
        </h2>

        <div className="card p-3 mb-4">

          <input
            type="file"
            className="form-control mb-3"
            onChange={(e) =>
              setFile(
                e.target.files[0]
              )
            }
          />

          <button
            className="btn btn-success"
            onClick={
              uploadImage
            }
          >
            Upload Image
          </button>

        </div>

        <div className="row">

          {images.map(
            (image) => (
              <div
                key={
                  image._id
                }
                className="col-md-3 mb-4"
              >
                <div className="card">

                  <img
                    src={
                      image.imageUrl
                    }
                    className="card-img-top"
                    alt="gallery"
                    style={{
                      height:
                        "200px",
                      objectFit:
                        "cover",
                    }}
                  />

                  <div className="card-body">

                    <button
                      className="btn btn-danger w-100"
                      onClick={() =>
                        deleteImage(
                          image._id
                        )
                      }
                    >
                      Delete
                    </button>

                  </div>

                </div>
              </div>
            )
          )}

        </div>

      </div>
    </>
  );
}