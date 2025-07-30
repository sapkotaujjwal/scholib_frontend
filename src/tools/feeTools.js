export function busPriceCalculator(
  date = "2024-12-30",
  dataArray,
  priceArray,
  date2 = "2024-01-01"
) {

  const getDaysDifference = (date2, date1) => {
    // Convert date strings to Date objects
    const dateObj1 = new Date(date1);
    const dateObj2 = new Date(date2);

    // Calculate the difference in milliseconds
    const differenceInMilliseconds = dateObj1 - dateObj2;

    // Convert milliseconds to days
    const differenceInDays = Math.floor(
      differenceInMilliseconds / (1000 * 60 * 60 * 24)
    );

    return differenceInDays;
  };

  let totalPrice = 0;

  dataArray.forEach((dataItem) => {
    const { place, start, end } = dataItem;
    const priceItem = priceArray.find((item) => item._id.toString() === place);

    if (priceItem) {
      const { amounts } = priceItem;
      let startDate = start;

      // Adjust startDate if it's earlier than date2
      if (getDaysDifference(startDate, date2) < 0) {
        startDate = date2;
      }

      let endDate = end ? end : date; // Use provided end date or default to "date"

      // Sort amounts by date to ensure proper order
      const sortedAmounts = [...amounts].sort((a, b) => 
        getDaysDifference(a.date, b.date)
      );

      sortedAmounts.forEach((each, index) => {
        const currentAmountStart = each.date;
        const nextAmountStart = sortedAmounts[index + 1]
          ? sortedAmounts[index + 1].date
          : null;

        // Skip if current amount period starts after our end date
        if (getDaysDifference(currentAmountStart, endDate) > 0) {
          return;
        }

        // Skip if next amount period starts before our start date
        if (nextAmountStart && getDaysDifference(nextAmountStart, startDate) <= 0) {
          return;
        }

        // Determine the effective start and end for the current amount bracket
        const effectiveStart = getDaysDifference(currentAmountStart, startDate) > 0 
          ? currentAmountStart 
          : startDate;
        
        const effectiveEnd = nextAmountStart && getDaysDifference(nextAmountStart, endDate) < 0
          ? nextAmountStart
          : endDate;

        // Calculate days within this bracket (inclusive)
        const interval = getDaysDifference(effectiveEnd, effectiveStart);

        if (interval >= 0) {
          totalPrice += (each.amount / 30) * (interval + 1);
        }
      });
    }
  });

  return Math.ceil(totalPrice);
}