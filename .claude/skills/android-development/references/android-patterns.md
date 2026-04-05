# Android Common Patterns

Concrete Kotlin/Compose patterns for ViewModel, state collection, repository caching, and Hilt DI.

## ViewModel with StateFlow

```kotlin
@HiltViewModel
class MyViewModel @Inject constructor(
    private val repository: MyRepository
) : ViewModel() {
    val uiState: StateFlow<UiState> = repository.observeData()
        .map { data -> UiState.Success(data) }
        .catch { emit(UiState.Error(it.message ?: "Error")) }
        .stateIn(
            scope = viewModelScope,
            started = SharingStarted.WhileSubscribed(5000),
            initialValue = UiState.Loading
        )
}
```

## Compose with State Collection

```kotlin
@Composable
fun MyScreen(viewModel: MyViewModel = hiltViewModel()) {
    val uiState by viewModel.uiState.collectAsStateWithLifecycle()

    when (val state = uiState) {
        is UiState.Loading -> LoadingView()
        is UiState.Success -> SuccessView(state.data)
        is UiState.Error -> ErrorView(state.message)
    }
}
```

## Repository with Caching

```kotlin
class MyRepository @Inject constructor(
    private val api: ApiService,
    private val dao: MyDao
) {
    fun observeData(): Flow<List<Item>> = dao.observeAll()

    suspend fun refresh() {
        val items = api.fetchItems()
        dao.insertAll(items)
    }
}
```

## Sealed UiState Interface

```kotlin
sealed interface UiState {
    data object Loading : UiState
    data class Success(val data: List<Item>) : UiState
    data class Error(val message: String) : UiState
}
```

## Hilt Module

```kotlin
@Module
@InstallIn(SingletonComponent::class)
abstract class RepositoryModule {
    @Binds
    abstract fun bindMyRepository(impl: MyRepositoryImpl): MyRepository
}
```

## Coroutine Patterns

- Use `viewModelScope.launch` for fire-and-forget operations
- Use `stateIn` with `WhileSubscribed(5000)` to cancel collection when UI is not visible
- Use `combine` for merging multiple Flows
- Use `flatMapLatest` for search-as-you-type

## Related References

- `references/mvvm-architecture.md` — Layer responsibilities, data flow diagram
- `references/compose-best-practices.md` — State hoisting, recomposition optimization, side effects
- `references/error-handling.md` — Result wrapper, retry logic, validation patterns
- `references/usage-and-compatibility.md` — Step-by-step setup guides, version matrix
