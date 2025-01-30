function getClassesChain(allCourses) {
  allCourses = allCourses.map((each) => {
    return {
      next: each.next,
      _id: each._id.toString(), // Modify the _id field to string
    };
  });

  // Helper function to find a course by ID
  const findCourseById = (id) =>
    allCourses.find((course) => course._id === id || course.id === id);

  // Helper function to get complete chain starting from a course
  function getCompleteChain(startCourse) {
    const chain = [];
    let current = startCourse;

    while (current) {
      chain.push(current._id || current.id);
      if (!current.next) break;
      current = findCourseById(current.next);
    }

    return chain;
  }

  // Helper function to get chain backwards
  function getBackwardChain(startCourse) {
    const chain = [];
    let current = startCourse;

    // Find courses that point to current course
    while (true) {
      const prevCourse = allCourses.find(
        (course) =>
          (course._id || course.id) !== (current._id || current.id) &&
          course.next === (current._id || current.id)
      );
      if (!prevCourse) break;
      chain.unshift(prevCourse._id || prevCourse.id);
      current = prevCourse;
    }

    return chain;
  }

  const chains = new Set();
  const processedCourses = new Set();

  // Process all courses to create chains
  allCourses.forEach((course) => {
    if (processedCourses.has(course._id)) return;

    // Get the complete chain (forward and backward)
    const forwardChain = getCompleteChain(course);
    const backwardChain = getBackwardChain(course);
    const fullChain = [...backwardChain, ...forwardChain];

    // Add all courses in the chain to processedCourses to avoid duplicates
    fullChain.forEach((courseId) => processedCourses.add(courseId));

    // Convert chain to string for comparison
    chains.add(fullChain.join(","));
  });

  // Convert chains back to arrays and sort them
  const result = [...chains].map((chain) => chain.split(","));

  return result;
}
  

export default getClassesChain;
