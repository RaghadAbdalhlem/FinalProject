/* eslint-disable react-hooks/exhaustive-deps */
import { Card, Col, Row, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem, Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";
import DataTable from "react-data-table-component";
import { toast } from "react-toastify";
import { Archive, ChevronDown, MoreVertical, Trash2 } from "react-feather";
import { useNavigate } from "react-router-dom";
import { useDeleteProductMutation, useGetProductsQuery } from "../../redux/api/productAPI";
import { useEffect, useState } from "react";

const ContentProducts = () => {
  const navigate = useNavigate();
  const [deleteProduct] = useDeleteProductMutation();
  const { data: products, refetch, isLoading } = useGetProductsQuery();
  const [selectedId, setSelectedId] = useState(null);
  const [modalDeleteVisibility, setModalDeleteVisibility] = useState(false);

  useEffect(() => {
    refetch();
  }, [refetch]); // Ensures fresh data on component mount

  const toggleDeleteModal = (id) => {
    setSelectedId(id);
    setModalDeleteVisibility(!modalDeleteVisibility);
  };

  const renderMedia = (media) => {
    if (!media) return null;

    const isVideo = /\.(mp4|webm|ogg)$/i.test(media); // Check if media is a video file

    return isVideo ? (
      <video
        src={media}
        className="img-fluid"
        style={{ maxWidth: "50px", maxHeight: "50px" }}
        controls
      />
    ) : (
      <img
        src={media}
        alt="Product"
        className="img-fluid"
        style={{ maxWidth: "50px", maxHeight: "50px" }}
      />
    );
  };

  const columns = [
    {
      name: "Image",
      width: "100px",
      cell: (row) => renderMedia(row.image),
    },
    {
      name: "Product Title",
      width: "150px",
      selector: (row) => row.title,
      sortable: true,
    },
    {
      name: "Category",
      width: "120px",
      selector: (row) => row.category,
      sortable: true,
    },
    {
      name: "Price",
      width: "100px",
      selector: (row) => row.price,
      sortable: true,
    },
    {
      name: "Description",
      selector: (row) =>
        row.description.length > 30
          ? `${row.description.substring(0, 30)}...`
          : row.description,
      sortable: true,
      grow: 2,
    },
    {
      name: "Usage Instructions",
      selector: (row) =>
        row.usageInstructions.length > 30
          ? `${row.usageInstructions.substring(0, 30)}...`
          : row.usageInstructions,
      sortable: true,
      grow: 2,
    },
    {
      name: "Actions",
      width: "120px",
      cell: (row) => (
        <UncontrolledDropdown>
          <DropdownToggle tag="div" className="btn btn-sm">
            <MoreVertical size={14} className="cursor-pointer action-btn" />
          </DropdownToggle>
          <DropdownMenu end container="body">
            <DropdownItem
              className="w-100"
              onClick={() => navigate(`/content-manager/products/update/${row._id}`)}
            >
              <Archive size={14} className="mx-1" />
              <span className="align-middle mx-2">Edit</span>
            </DropdownItem>

            <DropdownItem onClick={() => toggleDeleteModal(row._id)}>
              <Trash2 size={14} className="mx-1" />
              <span className="align-middle mx-2">Delete</span>
            </DropdownItem>
          </DropdownMenu>
        </UncontrolledDropdown>
      ),
    },
  ];

  const handleDeleteProduct = async () => {
    try {
      if (selectedId) {
        await deleteProduct(selectedId).unwrap();
        toast.success("Product deleted successfully");
        refetch();
      }
    } catch (error) {
      const errorMessage =
        error?.data?.message || "An unexpected error occurred.";
      toast.error(errorMessage);
    } finally {
      setModalDeleteVisibility(false);
    }
  };

  return (
    <div className="container main-view">
      <Row className="my-3">
        <Col>
          <h3 className="mb-3">Product Management</h3>
          <a href="/content-manager/products/create" className="btn btn-primary btn-sm">
            Create Product
          </a>
        </Col>
      </Row>
      <Row>
        <Col>
          <Card>
            <DataTable
              title="Products"
              data={products || []}
              responsive
              className="react-dataTable"
              noHeader
              pagination
              paginationRowsPerPageOptions={[10, 25, 50]}
              columns={columns}
              sortIcon={<ChevronDown />}
              highlightOnHover
              progressPending={isLoading} // Show loader while fetching
            />
          </Card>
        </Col>
      </Row>
      <Modal
        isOpen={modalDeleteVisibility}
        toggle={() => toggleDeleteModal()}
      >
        <ModalHeader toggle={() => toggleDeleteModal()}>
          Delete Confirmation
        </ModalHeader>
        <ModalBody>
          Are you sure you want to delete this product?
        </ModalBody>
        <ModalFooter>
          <Button color="danger" onClick={handleDeleteProduct}>
            Delete
          </Button>
          <Button
            color="secondary"
            onClick={() => toggleDeleteModal()}
            outline
          >
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default ContentProducts;
