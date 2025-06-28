/* eslint-disable react-hooks/exhaustive-deps */
import { Card, Col, Row, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem, Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";
import DataTable from "react-data-table-component";
import { toast } from "react-toastify";
import { Archive, ChevronDown, MoreVertical, Trash2 } from "react-feather";
import { useNavigate } from "react-router-dom";
import { useDeleteRecipeMutation, useGetRecipesQuery } from "../../redux/api/recipeAPI";
import { useEffect, useState } from "react";
import FullScreenLoader from "../../components/FullScreenLoader";

const ContentRecipes = () => {
  const navigate = useNavigate();
  const [deleteRecipe] = useDeleteRecipeMutation();
  const { data, refetch, isLoading } = useGetRecipesQuery();
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
        alt="Recipe"
        className="img-fluid"
        style={{ maxWidth: "50px", maxHeight: "50px" }}
      />
    );
  };

  const columns = [
    {
      name: "Media",
      width: "100px",
      cell: (row) => renderMedia(row.media),
    },
    {
      name: "Title",
      width: "150px",
      selector: (row) => row.title,
      sortable: true,
    },
    {
      name: "Diet Type",
      width: "120px",
      selector: (row) => row.dietType,
      sortable: true,
    },
    {
      name: "Nutritional Info",
      width: "200px", // Adjust width for full data
      selector: (row) =>
        row.nutritionalInfo
          ? `Calories: ${row.nutritionalInfo.calories || 0}, Carbs: ${row.nutritionalInfo.carbs || 0}g, Protein: ${row.nutritionalInfo.protein || 0}g, Fats: ${row.nutritionalInfo.fats || 0}g`
          : "N/A",
      sortable: true,
    },
    {
      name: "Ingredients",
      width: "250px", // Adjust width for full data
      selector: (row) =>
        row.ingredients?.length
          ? row.ingredients
              .map((ingredient) => `${ingredient.name} (${ingredient.amount}g)`)
              .join(", ")
          : "N/A",
      sortable: true,
      grow: 2,
    },
    {
      name: "Instructions",
      selector: (row) =>
        row.instructions.length > 30
          ? `${row.instructions.substring(0, 30)}...`
          : row.instructions,
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
              onClick={() => navigate(`/content-manager/recipes/update/${row._id}`)}
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


  const handleDeleteRecipe = async () => {
    try {
      if (selectedId) {
        await deleteRecipe(selectedId).unwrap();
        toast.success("Recipe deleted successfully");
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

  if (isLoading) {
    return (<FullScreenLoader />);
  }

  return (
    <div className="container main-view">
      <Row className="my-3">
        <Col>
          <h3 className="mb-3">Recipe Management</h3>
          <a href="/content-manager/recipes/create" className="btn btn-primary btn-sm">
            Create Recipe
          </a>
        </Col>
      </Row>
      <Row>
        <Col>
          <Card>
            <DataTable
              title="Recipes"
              data={data.recipes || []}
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
          Are you sure you want to delete this recipe?
        </ModalBody>
        <ModalFooter>
          <Button color="danger" onClick={handleDeleteRecipe}>
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

export default ContentRecipes;
