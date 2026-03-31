# Formatting, Structure, and Classes — Detailed Rules

## Formatting

### Newspaper Metaphor

Structure files like a newspaper article: the headline (public API) at top, details descending, fine print at bottom. A reader should be able to understand intent by skimming the top.

```typescript
// Good — public surface first, implementation details below
export class InvoiceService {
  // Public API — callers see this first
  async create(params: CreateInvoiceParams): Promise<Invoice> { ... }
  async markAsPaid(id: string): Promise<void> { ... }

  // Private helpers — implementation details hidden below
  private calculateTax(subtotal: number): number { ... }
  private buildLineItems(params: CreateInvoiceParams): LineItem[] { ... }
}
```

### Vertical Density Rules

| Concept | Rule |
|---------|------|
| Blank lines | Separate distinct concepts; don't separate closely related lines |
| Related functions | Place callee directly below caller |
| Instance variables | Group at top of class; no vertical scatter |
| Variable declarations | Declare at point of first use (not at top of method) |

```typescript
// Bad — blank lines breaking related code; variable declared far from use
function processPayment(amount: number): void {
  const taxRate = 0.2;

  const fee = amount * 0.01;

  const total = amount + fee;

  const tax = total * taxRate;
  charge(total + tax);
}

// Good — grouped by concept
function processPayment(amount: number): void {
  const fee = amount * 0.01;
  const total = amount + fee;

  const taxRate = 0.2;
  const tax = total * taxRate;

  charge(total + tax);
}
```

### Line Length

Keep lines to ≤120 characters. Long lines signal either over-nesting or missing an extraction.

### Indentation

Never collapse scope to save lines. Each level of nesting gets its own indent.

```typescript
// Bad — collapsed for brevity; hard to scan
if (user) { if (user.isActive) { return user.email; } }

// Good — scannable structure
if (user) {
  if (user.isActive) {
    return user.email;
  }
}
```

### Team Consistency

Commit a shared formatter config. Formatting debates waste review time.

| Stack | Tool | Config file |
|-------|------|------------|
| TypeScript | Prettier | `.prettierrc` |
| Java | Checkstyle or Google Java Format | `checkstyle.xml` |

---

## Objects and Data Structures

### Data Abstraction

Expose behavior, not internal fields. Callers should not need to know how data is stored.

```typescript
// Bad — exposes internal representation; callers depend on field names
interface Vehicle {
  fuelTankCapacityInGallons: number;
  gallonsOfGasolineInTank: number;
}

// Good — abstracted operation; internal storage is irrelevant
interface Vehicle {
  getFuelRemainingPercent(): number;
}
```

```java
// Bad
public class BankAccount {
  public double balance; // callers reach in directly
}

// Good
public class BankAccount {
  private double balance;
  public double getBalance() { return balance; }
  public void deposit(double amount) { balance += amount; }
}
```

### Law of Demeter

A method `m` of class `C` should call methods only on:
- `C` itself
- Objects passed as parameters to `m`
- Objects created inside `m`
- Direct fields of `C`

```typescript
// Bad — "train wreck": reaches through unrelated objects
const streetName = user.getAddress().getCity().getStreet().getName();

// Good — each object handles its own responsibility
const streetName = user.getStreetName(); // User delegates internally
```

```java
// Bad
String city = order.getCustomer().getAddress().getCity();

// Good
String city = order.getCustomerCity(); // Order delegates
```

### DTOs (Data Transfer Objects)

Pure data containers for crossing layer boundaries (API response, DB row, form payload). No behavior.

```typescript
// DTO — data only, no methods
interface CreateOrderRequest {
  customerId: string;
  items: OrderItemDto[];
  currency: string;
}

// Domain object — behavior lives here
class Order {
  private items: OrderItem[];
  calculateTotal(): Money { ... }
  addItem(item: OrderItem): void { ... }
}
```

### Hybrid Objects (Avoid)

Objects that are half data structure, half object combine the worst of both. Either: (a) expose data via an interface (pure data), or (b) encapsulate data with behavior (pure object).

---

## Classes

### Small and Single Responsibility

Count responsibilities, not lines. A class has one responsibility when it has exactly one reason to change.

```typescript
// Bad — two reasons to change: email format AND user persistence
class UserManager {
  save(user: User): void { ... }
  sendWelcomeEmail(user: User): void { ... }
  formatEmailBody(name: string): string { ... }
}

// Good — separated responsibilities
class UserRepository {
  save(user: User): void { ... }
}
class UserEmailService {
  sendWelcomeEmail(user: User): void { ... }
  private formatEmailBody(name: string): string { ... }
}
```

### Stepdown Rule

Public methods at the top. Private methods directly below the public method that calls them — not at the bottom of the file.

```typescript
export class ReportGenerator {
  // Public
  generate(params: ReportParams): Report { ... }

  // Private helpers for generate()
  private fetchData(params: ReportParams): RawData { ... }
  private transform(data: RawData): ProcessedData { ... }
  private format(data: ProcessedData): Report { ... }
}
```

### Open/Closed Principle

Prefer composition over inheritance. Add behavior by implementing an interface or wrapping a class, not by modifying it.

```typescript
// Bad — every new format type requires modifying the class
class ReportExporter {
  export(report: Report, format: string): void {
    if (format === 'pdf') { ... }
    else if (format === 'csv') { ... }
    // adding xlsx means editing this class
  }
}

// Good — new format = new class, no modification
interface ReportFormatter {
  format(report: Report): Buffer;
}
class PdfFormatter implements ReportFormatter { ... }
class CsvFormatter implements ReportFormatter { ... }
```

### Instance Variables

Minimize instance variables. Every instance variable is a possible state combination. More state = harder to reason about.

| Guideline | Rule |
|-----------|------|
| Declare at top | All instance variables grouped at class top |
| Minimize count | If a field is only used by 1 method, it may belong as a local variable or separate class |
| No temporal coupling | Don't require callers to call methods in a specific order to initialize state |
