class DomainError(Exception):
    """Base exception for all Aurora core domain errors."""
    pass


class CyclicDependencyError(DomainError):
    """Raised when adding or updating a dependency introduces a cycle in the DAG."""
    def __init__(self, cycle_nodes: list):
        self.cycle_nodes = cycle_nodes
        message = f"Cyclic dependency detected: {' -> '.join(cycle_nodes)}"
        super().__init__(message)


class SelfDependencyError(DomainError):
    """Raised when an entity attempts to depend on itself."""
    def __init__(self, entity_id: str):
        self.entity_id = entity_id
        message = f"Self-dependency is invalid for entity: {entity_id}"
        super().__init__(message)


class EntityNotFoundError(DomainError):
    """Raised when a referenced entity ID does not exist in operational state."""
    def __init__(self, entity_type: str, entity_id: str):
        self.entity_type = entity_type
        self.entity_id = entity_id
        message = f"{entity_type} with ID '{entity_id}' not found."
        super().__init__(message)


class InvalidDependencyError(DomainError):
    """Raised when a dependency payload or relationship type is invalid."""
    pass


class InvalidDisruptionError(DomainError):
    """Raised when a disruption event targets an invalid or missing entity."""
    pass
